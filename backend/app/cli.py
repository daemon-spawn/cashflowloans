import json

import click
from flask.cli import AppGroup

reminders_cli = AppGroup("reminders", help="Daily loan reminders.")


@reminders_cli.command("run")
def run_reminders():
    """Refresh loan statuses and send due/overdue reminders and the owner digest."""
    from app.services import reminders

    click.echo(json.dumps(reminders.run()))


storage_cli = AppGroup("storage", help="Document storage.")


@storage_cli.command("init")
def init_storage_bucket():
    """Create the private Supabase Storage bucket for documents if it doesn't exist."""
    from flask import current_app

    storage = current_app.extensions["storage"]
    if not hasattr(storage, "ensure_bucket"):
        click.echo("Storage backend is not Supabase; nothing to do.")
        return
    click.echo(f"Bucket {storage.bucket}: {storage.ensure_bucket()}")
