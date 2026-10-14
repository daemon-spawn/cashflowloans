"""Email. Best effort: a failed email is logged and never fails the request."""

import smtplib
from email.message import EmailMessage

from flask import current_app


def email_configured() -> bool:
    return bool(current_app.config["SMTP_HOST"])


def send_email(to: str, subject: str, body: str) -> bool:
    """Returns True when the message was handed to the mail server."""
    cfg = current_app.config
    if not email_configured():
        current_app.logger.info("Email not configured; would send %r to %s", subject, to)
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = cfg["SMTP_FROM"] or cfg["SMTP_USERNAME"]
    msg["To"] = to
    msg["Reply-To"] = cfg["NOTIFY_EMAIL"]
    msg.set_content(body)
    try:
        with smtplib.SMTP(cfg["SMTP_HOST"], cfg["SMTP_PORT"], timeout=15) as smtp:
            smtp.starttls()
            smtp.login(cfg["SMTP_USERNAME"], cfg["SMTP_PASSWORD"])
            smtp.send_message(msg)
        return True
    except Exception:
        current_app.logger.exception("Failed to send %r to %s", subject, to)
        return False


def notify_owner(subject: str, body: str) -> bool:
    return send_email(current_app.config["NOTIFY_EMAIL"], subject, body)
