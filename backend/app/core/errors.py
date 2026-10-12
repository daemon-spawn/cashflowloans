from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException


class ApiError(Exception):
    """Raise from any route to return {"error": message, "fields": {...}} with a status code."""

    def __init__(self, message: str, status: int = 400, fields: dict[str, list[str]] | None = None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.fields = fields


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        body = {"error": err.message}
        if err.fields:
            body["fields"] = err.fields
        return jsonify(body), err.status

    @app.errorhandler(HTTPException)
    def handle_http_error(err: HTTPException):
        return jsonify({"error": err.description}), err.code

    @app.errorhandler(Exception)
    def handle_unexpected(err: Exception):
        app.logger.exception("Unhandled error")
        return jsonify({"error": "Something went wrong on our side. Please try again."}), 500
