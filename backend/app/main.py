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

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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
