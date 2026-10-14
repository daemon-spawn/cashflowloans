"""Validation for uploaded application documents."""

from dataclasses import dataclass

from werkzeug.datastructures import FileStorage, MultiDict

from app.core.errors import ApiError
from app.models.enums import DocumentKind, LoanType

MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_COLLATERAL_IMAGES = 6

# Form field name → document kind
FIELD_KINDS = {
    "idDocument": DocumentKind.ID_DOCUMENT,
    "payslip": DocumentKind.PAYSLIP,
    "bankStatement": DocumentKind.BANK_STATEMENT,
    "collateralImages": DocumentKind.COLLATERAL_IMAGE,
}

REQUIRED_FIELDS = {
    LoanType.UNSECURED: ["idDocument", "payslip", "bankStatement"],
    LoanType.SECURED: ["idDocument", "collateralImages"],
}

# Identify files by their first bytes, not by the extension or browser-supplied type.
_SIGNATURES = {
    b"%PDF-": ("application/pdf", "pdf"),
    b"\xff\xd8\xff": ("image/jpeg", "jpg"),
    b"\x89PNG\r\n\x1a\n": ("image/png", "png"),
}


@dataclass
class UploadedFile:
    field: str
    kind: DocumentKind
    filename: str
    content_type: str
    extension: str
    data: bytes


def _sniff(data: bytes) -> tuple[str, str] | None:
    for sig, info in _SIGNATURES.items():
        if data.startswith(sig):
            return info
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ("image/webp", "webp")
    return None


def _validate(
    item: FileStorage, field: str, errors: dict[str, list[str]]
) -> tuple[bytes, tuple[str, str]] | None:
    data = item.read(MAX_FILE_BYTES + 1)
    if len(data) > MAX_FILE_BYTES:
        errors.setdefault(field, []).append(f"{item.filename} is larger than 10 MB")
        return None
    sniffed = _sniff(data)
    images_only = field == "collateralImages"
    pdf_only = field == "bankStatement"
    if (
        not sniffed
        or (images_only and not sniffed[0].startswith("image/"))
        or (pdf_only and sniffed[0] != "application/pdf")
    ):
        errors.setdefault(field, []).append(f"{item.filename} is not a supported file type")
        return None
    return data, sniffed


def collect_uploads(
    files: MultiDict[str, FileStorage], loan_type: LoanType, *, required: bool = True
) -> list[UploadedFile]:
    """Application documents. Staff-entered applications (phone, WhatsApp) may add them later."""
    errors: dict[str, list[str]] = {}
    result: list[UploadedFile] = []

    for field in REQUIRED_FIELDS[loan_type]:
        items = [f for f in files.getlist(field) if f and f.filename]
        if not items:
            if required:
                errors[field] = ["This document is required"]
            continue
        if field == "collateralImages" and len(items) > MAX_COLLATERAL_IMAGES:
            errors[field] = [f"Upload at most {MAX_COLLATERAL_IMAGES} photos"]
            continue

        for item in items:
            if checked := _validate(item, field, errors):
                data, (content_type, ext) = checked
                result.append(UploadedFile(field, FIELD_KINDS[field], item.filename, content_type, ext, data))

    if errors:
        raise ApiError("Please check your documents.", 422, errors)
    return result


def collect_single(files: MultiDict[str, FileStorage], kind: DocumentKind) -> UploadedFile:
    """One document added by staff from the CRM."""
    item = files.get("file")
    if not item or not item.filename:
        raise ApiError("Choose a file to upload.", 422, {"file": ["Required"]})
    field = next((f for f, k in FIELD_KINDS.items() if k == kind), "file")
    errors: dict[str, list[str]] = {}
    checked = _validate(item, field, errors)
    if not checked:
        raise ApiError("Please check the file.", 422, {"file": errors.get(field, ["Unsupported file"])})
    data, (content_type, ext) = checked
    return UploadedFile("file", kind, item.filename, content_type, ext, data)
