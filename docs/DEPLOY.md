# Deploying

Three places: **Supabase** (staff logins, documents), **Render** (API, database, daily reminders) and **Vercel** (website, CRM). Secret values go only in those dashboards, never in this repo.

## 1. Supabase — project `qazfvknrhrcewgosljgf`

1. **Authentication → Sign In / Providers → Email:** turn **off** "Allow new users to sign up". Only staff should have accounts.
2. **Authentication → Users → Add user → Create new user** for each staff member (owner and developer), with a password and *Auto Confirm User* ticked. Use the same emails as `STAFF_EMAILS` below.
3. **Authentication → URL Configuration:** Site URL = the CRM's address (e.g. `https://crm.cashflowloans.co.za`).
4. Storage needs nothing: the API creates the private `documents` bucket on its first deploy (`flask storage init`).

## 2. Render — Blueprint

**New → Blueprint → connect this repo.** `render.yaml` creates:

| Service | Plan | What it is |
|---|---|---|
| `cashflow-api` | Starter | Flask API. Runs migrations and creates the storage bucket before each deploy. |
| `cashflow-reminders` | Cron (Starter) | 09:00 SAST daily: due/overdue emails and the owner summary. |
| `cashflow-db` | Postgres basic-256mb | The database. |

Render asks for the values marked `sync: false`:

| Variable | `cashflow-api` | `cashflow-reminders` | Value |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | | Supabase **secret key** (`sb_secret_…`), from Project Settings → API Keys |
| `STAFF_EMAILS` | ✓ | | Comma-separated staff emails, same as the Supabase users |
| `TURNSTILE_SECRET_KEY` | ✓ | | Cloudflare Turnstile secret (leave empty until Turnstile is set up) |
| `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD` | ✓ | ✓ | The mailbox that sends email (e.g. info@cashflowloans.co.za's SMTP settings) |
| `SMTP_FROM` | ✓ | ✓ | e.g. `Cashflow Loans <info@cashflowloans.co.za>` |

`SUPABASE_URL`, `CORS_ORIGINS`, `NOTIFY_EMAIL` and the database connection are set by the Blueprint. Add the CRM's Vercel address to `CORS_ORIGINS` once it exists (document uploads go from the CRM in the browser straight to the API).

Check: `https://cashflow-api.onrender.com/health` returns `{"status":"ok"}`.

## 3. Vercel

**Website** (existing project, root directory `website`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://cashflow-api.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://cashflowloans.co.za` |

**CRM** (new project from the same repo, root directory `crm`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://cashflow-api.onrender.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qazfvknrhrcewgosljgf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase **publishable key** (`sb_publishable_…`) |

Redeploy after changing `NEXT_PUBLIC_*` values: they are built into the pages.

## 4. Domains (domains.co.za)

- `cashflowloans.co.za` and `www` → the website project (Vercel shows the DNS records to add).
- `crm.cashflowloans.co.za` → the CRM project.

## After go-live

- Sign in to the CRM, open **Settings** and use **Send test email**.
- Submit a test application on the website and check it arrives on the Applications board.
- Rotate the Supabase secret key if it was ever shared outside the dashboards, and update `SUPABASE_SERVICE_ROLE_KEY` on Render.
