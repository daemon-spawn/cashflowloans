# Architecture

## Systems

| System | Tech | Hosting | Role |
|---|---|---|---|
| Website | Next.js 16, Tailwind 4, shadcn/ui, GSAP, Lenis | Vercel | Marketing pages, calculator, application + contact forms |
| CRM | Next.js 16, Tailwind 4, shadcn/ui | Vercel | Staff pipeline, clients, loans, payments, messages |
| API | Flask 3, SQLAlchemy 2, Alembic | Render | All business logic and data access |
| Database | Postgres 16 | Render | Clients, applications, loans, payments, documents, notes, messages |
| Auth | Supabase Auth | Supabase | Staff sign-in for the CRM (owner + developer) |
| Files | Supabase Storage (private bucket) | Supabase | ID copies, payslips, bank statements, collateral photos |

## Data flow

```
Applicant ──▶ website /apply ──multipart──▶ POST /v1/public/applications
                                             ├─ validate (pydantic, SA ID, file sniffing)
                                             ├─ upsert client by ID number
                                             ├─ upload documents → Supabase Storage (private)
                                             ├─ insert application + documents (one transaction)
                                             └─ email owner
Staff ──▶ CRM ──Supabase JWT──▶ /v1/* (JWKS verified + STAFF_EMAILS allowlist)
                                 └─ documents served as 5-minute signed URLs
```

## Rules that fixed the old system

- **No silent failures.** If the API or storage fails, the applicant sees an error and is pointed to WhatsApp. Nothing is saved to the browser.
- **Public endpoints are write-only.** Reading data always needs a verified staff token. Rate limits and Cloudflare Turnstile protect the forms.
- **One client per SA ID number.** Repeat customers get a new application on their existing record.
- **Applications ≠ loans.** An application is a request (new → in review → approved/declined). A loan exists once money is paid out (active → due → overdue → paid).
- **Loan maths has one owner.** `backend/app/core/loan_rules.py` is the authority; `packages/core/src/loan.ts` mirrors it for display.
- **One balance formula.** `backend/app/core/ledger.py` builds every balance from payout, fee, payments and missed due dates. Overview, loan pages, reminders and reports all use it. The old CRM had three different "outstanding" formulas.
- **Nothing is deleted to say no.** Declining keeps the application with its reason; the old CRM deleted the client.
- **Everything is logged.** Each status change, payout, payment, write-off, collateral update and contact edit writes an `activities` row with the staff member's email.

## Loan lifecycle

```
Application  new ──▶ in_review ──▶ approved ──────────────────▶ (declined, with reason)
                                     │ loan created automatically
Loan                          pending_payout ──payout──▶ active ──▶ due ──▶ overdue ──▶ paid
                                                            (3 days before)  │        ▲
                                                                             └ write-off
```

- **Payout** sets the payout date and the due date: one month after payout, or the applicant's chosen date if it falls inside that month. Staff can change both.
- **Balance** = principal + 50% fee. After each missed due date (the due date, then monthly), 50% of the outstanding balance is added. Payments on or before a due date count before that charge.
- **Payments** can't exceed what was owed on the payment date. Mistakes can be removed; the activity log keeps the record.
- **Secured loans** track collateral: awaiting collection → held → returned / sold.
- **Blacklisted clients** can only be approved with an explicit override.

## Emails

| When | To | Sent by |
|---|---|---|
| New website application | Owner (`NOTIFY_EMAIL`) | API, immediately |
| Approved / declined / paid out / paid in full | Applicant | API, immediately |
| Repayment due tomorrow, due today, overdue (once per missed due date) | Borrower | `cashflow-reminders` cron, 09:00 SAST |
| Daily summary: overdue, due, awaiting payout, awaiting review | Owner | `cashflow-reminders` cron, 09:00 SAST |

Each reminder is recorded in `reminder_logs`, so re-running the job sends nothing twice. The CRM's Settings page can send a test email and run the job on demand.
- **Secrets never live in the repo.** Only `.env.example` files are committed.

## Still to build

- CRM screens for the endpoints above.
- CRM-managed content: FAQ, testimonials and blog.
- Website: redesign, blog article migration, legal copy, Turnstile widget and testimonials.
- Content from the owner: testimonials, final terms and privacy policy.
