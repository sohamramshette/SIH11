from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api_router import api_router

logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    logger.info(f"Starting {settings.PROJECT_NAME} API [{settings.ENVIRONMENT}]")
    logger.info(f"CORS origins configured: {settings.CORS_ORIGINS}")
    try:
        from app.db.session import engine, SessionLocal
        from app.models import Base, User
        Base.metadata.create_all(bind=engine)

        # Verify seed demo users exist for live authentication
        db = SessionLocal()
        try:
            admin_user = db.query(User).filter(User.email == "admin.sih@aicte-demo.gov.in").first()
            if not admin_user:
                from app.db.init_db import init_db
                init_db()
        finally:
            db.close()

        logger.info("Database schema and demo accounts verified successfully.")
    except Exception as e:
        logger.warning(f"Database schema auto-check note: {e}")
    yield
    # Shutdown tasks
    logger.info(f"Shutting down {settings.PROJECT_NAME} API")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AICTE Application Validation, Document Authentication & Regulatory Compliance Verification (SIH 26261)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration - supports both explicit origins and wildcard regex for Vercel deploys
cors_origins = [o.strip() for o in settings.CORS_ORIGINS] if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
allow_origin_regex = None

if "*" in cors_origins:
    cors_origins = []
    allow_origin_regex = r"^https?:\/\/.*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Central API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_PREFIX,
        "problem_statement": "SIH26261",
    }


@app.get("/health", tags=["Root"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }
