import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, BigInteger, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.analysis import OCRResult, ExtractedField, TamperAnalysis, YOLODetection
    from app.models.compliance import Finding


class Document(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "documents"

    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Land, Building, Fire Safety, Faculty, Affiliation
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), default="application/pdf")
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0)
    
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)  # Supabase object key
    sha256: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    
    upload_status: Mapped[str] = mapped_column(String(50), default="Uploaded")
    processing_status: Mapped[str] = mapped_column(String(50), default="pending")  # queued, processing, completed, failed
    check_status: Mapped[str] = mapped_column(String(50), default="Preliminary Check Passed")  # Preliminary Check Passed, Review Required, Possible Inconsistency, Missing Information
    
    page_count: Mapped[int] = mapped_column(Integer, default=1)
    uploaded_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="documents")
    pages: Mapped[List["DocumentPage"]] = relationship("DocumentPage", back_populates="document", cascade="all, delete-orphan", order_by="DocumentPage.page_number.asc()")
    ocr_results: Mapped[List["OCRResult"]] = relationship("OCRResult", back_populates="document", cascade="all, delete-orphan")
    extracted_fields: Mapped[List["ExtractedField"]] = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")
    tamper_analyses: Mapped[List["TamperAnalysis"]] = relationship("TamperAnalysis", back_populates="document", cascade="all, delete-orphan")
    yolo_detections: Mapped[List["YOLODetection"]] = relationship("YOLODetection", back_populates="document", cascade="all, delete-orphan")
    findings: Mapped[List["Finding"]] = relationship("Finding", back_populates="document", cascade="all, delete-orphan")
    processing_jobs: Mapped[List["ProcessingJob"]] = relationship("ProcessingJob", back_populates="document", cascade="all, delete-orphan")


class DocumentPage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "document_pages"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    page_number: Mapped[int] = mapped_column(Integer, nullable=False)
    rendered_image_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    thumbnail_key: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    page_status: Mapped[str] = mapped_column(String(50), default="completed")
    processing_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="pages")


class ProcessingJob(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "processing_jobs"

    document_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    task_type: Mapped[str] = mapped_column(String(100), default="document_pipeline")  # ocr_digitise, tamper_screening, rules
    status: Mapped[str] = mapped_column(String(50), default="queued", index=True)  # queued, processing, completed, failed
    attempt_count: Mapped[int] = mapped_column(Integer, default=1)
    
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    error_code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metrics: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="processing_jobs")

