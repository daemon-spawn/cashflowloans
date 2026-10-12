# Jobs

Scheduled tasks run as Render Cron Jobs (`flask --app wsgi <command>`), not
inside the web process. Planned:

- `reminders` — daily: mark loans due/overdue, apply late balance rules, email the owner a summary.
