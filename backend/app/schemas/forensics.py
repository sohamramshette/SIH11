import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class TamperAnalysisOut(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    page_number: int
    model_name: str
    model_version: str
    model_score: Optional[float] = None
    predicted_label: Optional[str] = None
    mask_url: Optional[str] = None
    overlay_url: Optional[str] = None
    inference_status: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class YOLODetectionOut(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    page_number: int
    model_version: str
    class_id: int
    class_name: str
    confidence: float
    bbox: Dict[str, Any]
    crop_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class FindingOut(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    document_id: Optional[uuid.UUID] = None
    page_number: Optional[int] = None
    finding_type: str
    severity: str
    status: str
    title: str
    description: str
    evidence: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentForensicsResponse(BaseModel):
    document_id: uuid.UUID
    check_status: str
    tamper_analyses: List[TamperAnalysisOut] = []
    yolo_detections: List[YOLODetectionOut] = []
    findings: List[FindingOut] = []
