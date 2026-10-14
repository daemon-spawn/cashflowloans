import json

import click
from flask.cli import AppGroup

reminders_cli = AppGroup("reminders", help="Daily loan reminders.")


@reminders_cli.command("run")
def run_reminders():
    """Refresh loan statuses and send due/overdue reminders and the owner digest."""
    from app.services import reminders

    click.echo(json.dumps(reminders.run()))
