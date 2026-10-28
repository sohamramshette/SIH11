import uuid
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.document import Document


class OCRResult(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ocr_results"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    provider: Mapped[str] = mapped_column(String(50), default="sarvam")
    provider_job_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    raw_result_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    layout_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="completed")

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="ocr_results")


class ExtractedField(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "extracted_fields"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    field_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    field_label: Mapped[str] = mapped_column(String(150), nullable=False)
    field_value: Mapped[str] = mapped_column(Text, nullable=False)
    normalized_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    source_bbox: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)  # {x, y, width, height}
    
    is_overridden: Mapped[bool] = mapped_column(Boolean, default=False)
    overridden_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    override_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="extracted_fields")


class TamperAnalysis(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "tamper_analyses"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    page_number: Mapped[int] = mapped_column(Integer, default=1)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)  # ViT-ELA, DocTamper
    model_version: Mapped[str] = mapped_column(String(50), default="1.0.0")
    model_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    predicted_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # authentic, suspicious, tampered
    
    mask_storage_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    overlay_storage_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    inference_status: Mapped[str] = mapped_column(String(50), default="completed")
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="tamper_analyses")


class YOLODetection(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "yolo_detections"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    page_number: Mapped[int] = mapped_column(Integer, default=1)
    model_version: Mapped[str] = mapped_column(String(50), default="yolov8")
    class_id: Mapped[int] = mapped_column(Integer, nullable=False)
    class_name: Mapped[str] = mapped_column(String(100), nullable=False)  # stamp, signature, qr_code, letterhead
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    bbox: Mapped[dict] = mapped_column(JSONB, nullable=False)  # [x1, y1, x2, y2]
    crop_storage_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="yolo_detections")
