import uuid

from flask import request
from pydantic import BaseModel, ValidationError

from app.core.errors import ApiError
from app.extensions import db
from app.schemas import validation_error


def parse[T: BaseModel](schema: type[T], data: dict | None = None) -> T:
    try:
        return schema.model_validate(data if data is not None else (request.get_json(silent=True) or {}))
    except ValidationError as exc:
        raise validation_error(exc) from exc


def get_or_404(model, raw_id: str | None, label: str, options=()):
    try:
        key = uuid.UUID(str(raw_id))
    except ValueError as exc:
        raise ApiError(f"{label} not found", 404) from exc
    obj = db.session.get(model, key, options=list(options))
    if obj is None:
        raise ApiError(f"{label} not found", 404)
    return obj
