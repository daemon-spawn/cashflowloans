import json

from flask import request
from pydantic import ValidationError

from app.api.public import bp
from app.core.errors import ApiError
from app.extensions import limiter
from app.schemas import validation_error
from app.schemas.application import ApplicationIn
from app.services.applications import create_application
from app.services.turnstile import verify_turnstile
from app.services.uploads import collect_uploads


@bp.post("/applications")
@limiter.limit("5 per hour; 20 per day")
def submit_application():
    """multipart/form-data: `data` (JSON), document files, optional `turnstileToken`."""
    verify_turnstile(request.form.get("turnstileToken"), request.remote_addr)

    try:
        payload = json.loads(request.form.get("data", ""))
        data = ApplicationIn.model_validate(payload)
    except json.JSONDecodeError as exc:
        raise ApiError("Invalid application data.", 400) from exc
    except ValidationError as exc:
        raise validation_error(exc) from exc

    uploads = collect_uploads(request.files, data.loan_type)
    application = create_application(data, uploads)
    return {"reference": application.reference}, 201
