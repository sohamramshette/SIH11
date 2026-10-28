import io
import hashlib
from typing import List, Tuple, Dict, Any, Optional
from pathlib import Path
import pymupdf as fitz
from PIL import Image
from fastapi import HTTPException, status
from app.core.config import settings

ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
}

# Magic bytes headers for forensic authenticity validation
MAGIC_SIGNATURES = {
    b"%PDF-": "pdf",
    b"\x89PNG\r\n\x1a\n": "png",
    b"\xff\xd8\xff": "jpg",
}


def calculate_sha256(file_bytes: bytes) -> str:
    """Calculate SHA-256 cryptographic digest of document bytes."""
    return hashlib.sha256(file_bytes).hexdigest()


def generate_audit_record_hash(
    audit_id: Any,
    action: str,
    entity_id: str,
    payload_hash: str,
    previous_hash: str = "0000000000000000000000000000000000000000000000000000000000000000",
) -> str:
    """Generate globally unique, tamper-evident cryptographic hash for audit block."""
    raw = f"{audit_id}:{action}:{entity_id}:{previous_hash}:{payload_hash}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def validate_file_upload(file_bytes: bytes, filename: str, mime_type: Optional[str] = None) -> str:
    """Validate upload size, file signature, and supported format."""
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_MB}MB.",
        )

    ext = Path(filename).suffix.lower().lstrip(".")
    allowed_exts = [e.strip().lower() for e in settings.ALLOWED_EXTENSIONS.split(",")]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file extension '.{ext}'. Allowed formats: {settings.ALLOWED_EXTENSIONS}.",
        )

    # Validate Magic Bytes / File Signature
    matched_type = None
    for sig, sig_type in MAGIC_SIGNATURES.items():
        if file_bytes.startswith(sig):
            matched_type = sig_type
            break

    if not matched_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not match genuine PDF or Image binary signature.",
        )

    return matched_type


def render_pdf_to_images(
    file_bytes: bytes, is_pdf: bool = True, dpi: int = 180
) -> List[Tuple[int, bytes, int, int]]:
    """
    Render PDF pages into 180 DPI PNG byte buffers.
    Returns: List of tuples: (page_number, png_bytes, width, height)
    """
    results = []

    if is_pdf:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            if doc.is_encrypted:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Encrypted or password-protected PDFs are not supported for statutory validation.",
                )

            for page_index, page in enumerate(doc):
                page_num = page_index + 1
                pix = page.get_pixmap(dpi=dpi, alpha=False)
                png_bytes = pix.tobytes("png")
                results.append((page_num, png_bytes, pix.width, pix.height))
            doc.close()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse and render PDF dossier: {str(e)}",
            )
    else:
        # Single image upload (PNG / JPG)
        try:
            image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            png_bytes = buffer.getvalue()
            results.append((1, png_bytes, image.width, image.height))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to decode image document: {str(e)}",
            )

    return results


def create_thumbnail(image_bytes: bytes, max_size: Tuple[int, int] = (200, 280)) -> bytes:
    """Generate a lightweight thumbnail for rapid UI rendering in review workspaces."""
    try:
        im = Image.open(io.BytesIO(image_bytes))
        im.thumbnail(max_size, Image.Resampling.LANCZOS)
        out_buf = io.BytesIO()
        im.save(out_buf, format="PNG", optimize=True)
        return out_buf.getvalue()
    except Exception:
        return image_bytes
