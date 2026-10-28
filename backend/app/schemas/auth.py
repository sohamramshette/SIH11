import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email or Official User ID (e.g., admin.sih@aicte-demo.gov.in or AICTE-ADM-001)")
    password: str = Field(..., min_length=4, description="User password")
    role_id: Optional[str] = Field(None, description="Optional role specifier for demo matching (admin, college, verification, senior-officer)")


class InstitutionSummary(BaseModel):
    id: uuid.UUID
    institution_name: str
    aishe_code: str
    permanent_institute_id: str
    region: str

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    official_id: Optional[str] = None
    designation: Optional[str] = None
    phone: Optional[str] = None
    institution_id: Optional[uuid.UUID] = None
    institution: Optional[InstitutionSummary] = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
