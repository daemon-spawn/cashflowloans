from flask import current_app, g, request

from app.api.staff import bp
from app.services import reminders, reports
from app.services.notifications import email_configured, notify_owner


@bp.get("/reports/overview")
def overview():
    return reports.overview()


@bp.get("/reports/analytics")
def analytics():
    return reports.analytics(request.args.get("timeframe", "1month"))


@bp.get("/settings")
def settings():
    cfg = current_app.config
    return {
        "staffEmails": sorted(cfg["STAFF_EMAILS"]),
        "notifyEmail": cfg["NOTIFY_EMAIL"],
        "emailConfigured": email_configured(),
        "you": g.staff_email,
    }


@bp.post("/settings/test-email")
def test_email():
    sent = notify_owner(
        "Cashflow CRM test email",
        f"This is a test email sent from the CRM by {g.staff_email}. If you can read it, email is working.",
    )
    return {"sent": sent, "emailConfigured": email_configured()}


@bp.post("/reminders/run")
def run_reminders():
    """The daily job, on demand (the old CRM's "Send Now")."""
    return reminders.run()
