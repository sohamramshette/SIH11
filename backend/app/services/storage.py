import os
from pathlib import Path
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import setup_logging

logger = setup_logging()

# Local upload cache directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class StorageService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL.rstrip("/")
        self.service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.bucket = settings.SUPABASE_STORAGE_BUCKET

    def _get_headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.service_role_key}",
            "apikey": self.service_role_key,
        }

    async def upload_file(self, storage_key: str, content: bytes, content_type: str = "application/octet-stream") -> str:
        """Upload file bytes to private Supabase Storage and mirror to local cache."""
        # 1. Always mirror to local disk for offline fast retrieval and worker processing
        local_path = UPLOAD_DIR / storage_key
        local_path.parent.mkdir(parents=True, exist_ok=True)
        with open(local_path, "wb") as f:
            f.write(content)

        # 2. Upload to Supabase Storage if configured with a real project
        if "supabase.co" in self.supabase_url and self.service_role_key and not self.service_role_key.startswith("your-"):
            try:
                url = f"{self.supabase_url}/storage/v1/object/{self.bucket}/{storage_key}"
                headers = self._get_headers()
                headers["Content-Type"] = content_type
                headers["x-upsert"] = "true"

                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, headers=headers, content=content)
                    if resp.status_code in [200, 201]:
                        logger.info(f"Uploaded {storage_key} to Supabase bucket '{self.bucket}'.")
                    else:
                        logger.warning(f"Supabase storage upload responded with {resp.status_code}: {resp.text[:120]}")
            except Exception as e:
                logger.warning(f"Could not reach remote Supabase Storage ({e}); local mirror preserved at {local_path}.")

        return storage_key

    async def get_signed_url(self, storage_key: str, expires_in: int = 900) -> str:
        """Generate a short-lived signed URL (15 min) or internal secure streaming URL."""
        if "supabase.co" in self.supabase_url and self.service_role_key and not self.service_role_key.startswith("your-"):
            try:
                url = f"{self.supabase_url}/storage/v1/object/sign/{self.bucket}/{storage_key}"
                headers = self._get_headers()
                payload = {"expiresIn": expires_in}

                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        signed_path = resp.json().get("signedURL", "")
                        return f"{self.supabase_url}/storage/v1{signed_path}"
            except Exception as e:
                logger.debug(f"Signed URL generation falling back to internal route: {e}")

        # Fallback to backend streaming endpoint
        return f"/api/v1/documents/files/{storage_key}"

    def read_file(self, storage_key: str) -> bytes:
        """Read file bytes from local disk mirror or Supabase storage."""
        local_path = UPLOAD_DIR / storage_key
        if local_path.exists():
            with open(local_path, "rb") as f:
                return f.read()

        # If not on local disk, fetch synchronously from Supabase Storage
        if "supabase.co" in self.supabase_url and self.service_role_key:
            url = f"{self.supabase_url}/storage/v1/object/authenticated/{self.bucket}/{storage_key}"
            headers = self._get_headers()
            with httpx.Client(timeout=15.0) as client:
                resp = client.get(url, headers=headers)
                if resp.status_code == 200:
                    with open(local_path, "wb") as f:
                        f.write(resp.content)
                    return resp.content

        raise FileNotFoundError(f"Storage object '{storage_key}' not found.")


storage_service = StorageService()
