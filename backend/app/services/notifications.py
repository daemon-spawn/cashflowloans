"""Owner notifications. Best effort: a failed email never fails the request."""

import smtplib
from email.message import EmailMessage

from flask import current_app


def notify_owner(subject: str, body: str) -> None:
    cfg = current_app.config
    if not cfg["SMTP_HOST"]:
        current_app.logger.info("Email not configured; would send %r", subject)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = cfg["SMTP_USERNAME"]
    msg["To"] = cfg["NOTIFY_EMAIL"]
    msg.set_content(body)
    try:
        with smtplib.SMTP(cfg["SMTP_HOST"], cfg["SMTP_PORT"], timeout=15) as smtp:
            smtp.starttls()
            smtp.login(cfg["SMTP_USERNAME"], cfg["SMTP_PASSWORD"])
            smtp.send_message(msg)
    except Exception:
        current_app.logger.exception("Failed to send notification %r", subject)
