from fastapi import APIRouter
from app.api.v1.system import router as system_router
from app.api.v1.auth import router as auth_router
from app.api.v1.documents import router as documents_router
from app.api.v1.compliance import router as compliance_router
from app.api.v1.applications import router as applications_router
from app.api.v1.audit import router as audit_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()

# Include feature sub-routers
api_router.include_router(system_router)
api_router.include_router(auth_router)
api_router.include_router(documents_router)
api_router.include_router(compliance_router)
api_router.include_router(applications_router)
api_router.include_router(audit_router)
api_router.include_router(reports_router)

