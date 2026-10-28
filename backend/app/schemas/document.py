import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class DocumentPageOut(BaseModel):
    id: uuid.UUID
    page_number: int
    page_status: str
    image_url: Optional[str] = None
    thumbnail_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ExtractedFieldSummary(BaseModel):
    id: uuid.UUID
    page_number: Optional[int] = None
    field_key: str
    field_label: str
    field_value: str
    normalized_value: Optional[str] = None
    confidence: float
    source_bbox: Optional[Dict[str, Any]] = None
    is_overridden: bool = False
    override_reason: Optional[str] = None

    model_config = {"from_attributes": True}


class ExtractedFieldOut(ExtractedFieldSummary):
    document_id: uuid.UUID
    overridden_by: Optional[uuid.UUID] = None
    created_at: datetime


class OCRResultOut(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    provider: str
    provider_job_id: Optional[str] = None
    extracted_text: Optional[str] = None
    layout_json: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class FieldOverrideRequest(BaseModel):
    field_value: str = Field(..., min_length=1, description="Corrected field value")
    override_reason: str = Field(..., min_length=3, description="Justification for manually modifying extracted field")


class ReprocessResponse(BaseModel):
    document_id: uuid.UUID
    status: str
    message: str


class DocumentOut(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    category: str
    title: str
    original_filename: str
    mime_type: str
    size_bytes: int
    sha256: str
    upload_status: str
    processing_status: str
    check_status: str
    page_count: int
    file_url: Optional[str] = None
    pages: List[DocumentPageOut] = []
    extracted_fields: List[ExtractedFieldSummary] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentUploadResponse(BaseModel):
    document_id: uuid.UUID
    application_id: uuid.UUID
    job_id: uuid.UUID
    title: str
    category: str
    filename: str
    sha256: str
    page_count: int
    status: str
    message: str
