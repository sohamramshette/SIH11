from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.session import get_db
from app.schemas.system import HealthResponse, SystemStatusResponse, ServiceCheck

router = APIRouter(prefix="/system", tags=["System & Health"])


@router.get("/health", response_model=HealthResponse)
def get_health():
    """Simple liveness probe endpoint."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )


@router.get("/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    """Comprehensive readiness and services status probe."""
    # Check Database connectivity
    try:
        db.execute(text("SELECT 1"))
        db_check = ServiceCheck(status="connected", details="Database query succeeded.")
    except Exception as e:
        db_check = ServiceCheck(status="error", details=str(e))

    services = {
        "supabase_storage": ServiceCheck(
            status="configured" if settings.SUPABASE_URL and "supabase.co" in settings.SUPABASE_URL else "mock_mode",
            details=f"Bucket: {settings.SUPABASE_STORAGE_BUCKET}"
        ),
        "sarvam_ai": ServiceCheck(
            status="configured" if settings.SARVAM_API_KEY and settings.SARVAM_API_KEY != "sk_sarvam_demo_key" else "standby",
            details="Sarvam Document AI ready for ingestion"
        ),
        "auth_jwt": ServiceCheck(
            status="active",
            details=f"Algorithm: {settings.JWT_ALGORITHM}, Expiry: {settings.ACCESS_TOKEN_EXPIRE_MINUTES}m"
        ),
    }

    overall_status = "healthy" if db_check.status == "connected" else "degraded"

    return SystemStatusResponse(
        project=settings.PROJECT_NAME,
        status=overall_status,
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        database=db_check,
        services=services,
        active_cors_origins=settings.CORS_ORIGINS,
    )
