import os


def _list(value: str | None) -> list[str]:
    return [v.strip() for v in (value or "").split(",") if v.strip()]


def _database_url() -> str:
    url = os.getenv("DATABASE_URL", "sqlite:///cashflow-dev.db")
    # Render provides postgres:// URLs; SQLAlchemy needs the psycopg driver name.
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url.removeprefix(prefix)
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    MAX_CONTENT_LENGTH = 70 * 1024 * 1024  # whole multipart request

    CORS_ORIGINS = _list(os.getenv("CORS_ORIGINS")) or ["http://localhost:3000", "http://localhost:3001"]

    SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "documents")
    STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")

    STAFF_EMAILS = {e.lower() for e in _list(os.getenv("STAFF_EMAILS"))}
    TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "")

    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM = os.getenv("SMTP_FROM", "")  # e.g. "Cashflow Loans <info@cashflowloans.co.za>"
    NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "cashflowloans.enquiry@gmail.com")

    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_HEADERS_ENABLED = True


class TestConfig(Config):
    TESTING = True
    # Set TEST_DATABASE_URL to run the suite against Postgres (it is wiped on every test).
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL", "sqlite://")
    SQLALCHEMY_ENGINE_OPTIONS = {}
    STORAGE_BACKEND = "memory"
    STAFF_EMAILS = {"owner@example.com"}
    TURNSTILE_SECRET_KEY = ""
    RATELIMIT_ENABLED = False
    SMTP_HOST = ""
