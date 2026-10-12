from pydantic import ValidationError

from app.core.errors import ApiError


def validation_error(exc: ValidationError) -> ApiError:
    """Convert a pydantic error into the {"error", "fields"} shape the frontends expect."""
    fields: dict[str, list[str]] = {}
    for err in exc.errors():
        key = ".".join(str(p) for p in err["loc"]) or "_"
        fields.setdefault(key, []).append(err["msg"].removeprefix("Value error, "))
    return ApiError("Please check the highlighted fields.", 422, fields)
