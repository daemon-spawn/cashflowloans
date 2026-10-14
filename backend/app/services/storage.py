"""
Document storage. Production uses a *private* Supabase Storage bucket; staff
get short-lived signed URLs. "local" and "memory" backends exist for dev/tests.
"""

from pathlib import Path
from typing import Protocol

import httpx
from flask import Flask, current_app


class Storage(Protocol):
    def upload(self, path: str, data: bytes, content_type: str) -> None: ...
    def delete(self, paths: list[str]) -> None: ...
    def signed_url(self, path: str, expires_in: int = 300) -> str | None: ...


class SupabaseStorage:
    def __init__(self, url: str, service_key: str, bucket: str):
        self.base = f"{url}/storage/v1"
        self.bucket = bucket
        # New-style secret keys (sb_secret_…) go in `apikey` only; the gateway turns them into a
        # service-role token. Legacy service_role keys are JWTs and also go in Authorization.
        headers = {"apikey": service_key}
        if not service_key.startswith("sb_"):
            headers["Authorization"] = f"Bearer {service_key}"
        self.http = httpx.Client(headers=headers, timeout=30)

    def ensure_bucket(self) -> str:
        """Create the private documents bucket if it doesn't exist. Safe to run on every deploy."""
        if self.http.get(f"{self.base}/bucket/{self.bucket}").status_code == 200:
            return "exists"
        res = self.http.post(
            f"{self.base}/bucket",
            json={
                "id": self.bucket,
                "name": self.bucket,
                "public": False,
                "file_size_limit": 10 * 1024 * 1024,
                "allowed_mime_types": ["application/pdf", "image/jpeg", "image/png", "image/webp"],
            },
        )
        res.raise_for_status()
        return "created"

    def upload(self, path: str, data: bytes, content_type: str) -> None:
        res = self.http.post(
            f"{self.base}/object/{self.bucket}/{path}",
            content=data,
            headers={"Content-Type": content_type, "x-upsert": "false"},
        )
        res.raise_for_status()

    def delete(self, paths: list[str]) -> None:
        if paths:
            self.http.request("DELETE", f"{self.base}/object/{self.bucket}", json={"prefixes": paths})

    def signed_url(self, path: str, expires_in: int = 300) -> str | None:
        res = self.http.post(f"{self.base}/object/sign/{self.bucket}/{path}", json={"expiresIn": expires_in})
        if res.is_error:
            return None
        return f"{self.base}{res.json()['signedURL']}"


class LocalStorage:
    """Writes to instance/uploads. Development only — never use in production."""

    def __init__(self, root: Path):
        self.root = root

    def upload(self, path: str, data: bytes, content_type: str) -> None:
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)

    def delete(self, paths: list[str]) -> None:
        for p in paths:
            (self.root / p).unlink(missing_ok=True)

    def signed_url(self, path: str, expires_in: int = 300) -> str | None:
        return None


class MemoryStorage:
    def __init__(self):
        self.files: dict[str, bytes] = {}

    def upload(self, path: str, data: bytes, content_type: str) -> None:
        self.files[path] = data

    def delete(self, paths: list[str]) -> None:
        for p in paths:
            self.files.pop(p, None)

    def signed_url(self, path: str, expires_in: int = 300) -> str | None:
        return f"memory://{path}"


def init_storage(app: Flask) -> None:
    backend = app.config["STORAGE_BACKEND"]
    if backend == "supabase":
        storage: Storage = SupabaseStorage(
            app.config["SUPABASE_URL"],
            app.config["SUPABASE_SERVICE_ROLE_KEY"],
            app.config["SUPABASE_STORAGE_BUCKET"],
        )
    elif backend == "memory":
        storage = MemoryStorage()
    else:
        storage = LocalStorage(Path(app.instance_path) / "uploads")
    app.extensions["storage"] = storage


def get_storage() -> Storage:
    return current_app.extensions["storage"]
