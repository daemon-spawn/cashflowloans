from dotenv import load_dotenv
from flask import Flask

from app.config import Config
from app.extensions import cors, db, limiter, migrate


def create_app(config: type[Config] = Config) -> Flask:
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(config)
    # Render terminates TLS in front of the app; trust one proxy hop for client IPs.
    from werkzeug.middleware.proxy_fix import ProxyFix

    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)

    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    cors.init_app(app, resources={r"/v1/*": {"origins": app.config["CORS_ORIGINS"]}})

    from app import models  # noqa: F401  register models for migrations
    from app.api import register_blueprints
    from app.core.errors import register_error_handlers
    from app.services.storage import init_storage

    init_storage(app)
    register_error_handlers(app)
    register_blueprints(app)

    from app.cli import reminders_cli, storage_cli

    app.cli.add_command(reminders_cli)
    app.cli.add_command(storage_cli)
    return app
