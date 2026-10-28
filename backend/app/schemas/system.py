from typing import Dict, Any, List
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Application health status")
    version: str = Field(default="1.0.0", description="API version")
    environment: str = Field(..., description="Active runtime environment")


class ServiceCheck(BaseModel):
    status: str
    details: str


class SystemStatusResponse(BaseModel):
    project: str
    status: str
    version: str
    environment: str
    database: ServiceCheck
    services: Dict[str, ServiceCheck]
    active_cors_origins: List[str]
