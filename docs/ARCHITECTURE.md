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
- **Secrets never live in the repo.** Only `.env.example` files are committed.

## Still to build

- CRM: pipeline drag-and-drop, client and loan detail pages, recording payments and payouts, notes, analytics.
- API: staff endpoints for clients, loans, payments, notes; the daily due/overdue job (Render Cron).
- Website: redesign, blog article migration, legal copy, Turnstile widget and testimonials.
- Content from the owner: testimonials, final terms and privacy policy.
