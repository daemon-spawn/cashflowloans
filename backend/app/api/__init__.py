from flask import Flask

from app.api.health import bp as health_bp
from app.api.public import bp as public_bp
from app.api.staff import bp as staff_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(health_bp)
    app.register_blueprint(public_bp, url_prefix="/v1/public")
    app.register_blueprint(staff_bp, url_prefix="/v1")
