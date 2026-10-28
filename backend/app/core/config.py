import os
from typing import List, Union, Optional
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AICTE VerifyAI"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///./aicte_verifyai.db"

    # Supabase
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_PUBLISHABLE_KEY: Optional[str] = None
    SUPABASE_SECRET_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWKS_URL: Optional[str] = None
    SUPABASE_STORAGE_BUCKET: str = "aicte-documents"

    # Sarvam Document AI API
    SARVAM_API_KEY: str = "sk_sarvam_demo_key"
    SARVAM_MAX_PAGES_PER_JOB: int = 20

    # JWT Authentication
    JWT_SECRET_KEY: str = "aicte-verifyai-jwt-dev-secret-key-super-secure-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Uploads
    MAX_UPLOAD_MB: int = 10
    ALLOWED_EXTENSIONS: str = "pdf,png,jpg,jpeg"

    @model_validator(mode="after")
    def reconcile_supabase_keys(self):
        # Allow SUPABASE_SECRET_KEY as an alias for SUPABASE_SERVICE_ROLE_KEY
        if self.SUPABASE_SECRET_KEY and (not self.SUPABASE_SERVICE_ROLE_KEY or self.SUPABASE_SERVICE_ROLE_KEY == "your-supabase-service-role-key"):
            self.SUPABASE_SERVICE_ROLE_KEY = self.SUPABASE_SECRET_KEY
        return self

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
