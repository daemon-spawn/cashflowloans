from app.extensions import db
from app.models import Activity, Application, Client, Loan


def record(
    client: Client,
    kind: str,
    message: str,
    actor: str,
    *,
    application: Application | None = None,
    loan: Loan | None = None,
) -> None:
    db.session.add(
        Activity(
            client_id=client.id,
            application_id=application.id if application else None,
            loan_id=loan.id if loan else None,
            kind=kind,
            message=message,
            actor=actor,
        )
    )
