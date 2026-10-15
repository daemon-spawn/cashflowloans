# Deploying, step by step

Order: **Supabase → Gmail app password → Render → Vercel → domains.** Secret values go only in those dashboards, never in this repo.

What you need open: the Supabase project `qazfvknrhrcewgosljgf`, the owner's Google account (cashflowloans.enquiry@gmail.com), a Render account, and Vercel.

---

## 1. Supabase (5 minutes)

Supabase handles staff logins for the CRM and stores the uploaded documents.

1. Open https://supabase.com/dashboard/project/qazfvknrhrcewgosljgf
2. **Stop public sign-ups.** Left menu **Authentication → Sign In / Providers**. Under *User Signups*, turn **off** "Allow new users to sign up" and **Save**. Only the two staff accounts below should exist.
3. **Create the owner's login.** **Authentication → Users → Add user → Create new user**
   - Email: `cashflowloans.enquiry@gmail.com`
   - Password: a strong password (give it to the owner privately)
   - Tick **Auto Confirm User**, then **Create user**
4. **Create the developer's login.** Same again with `syloncube837@gmail.com`.
5. **Copy two keys** from **Project Settings → API Keys** (keep this tab open for step 3):
   - **Secret key**, starts with `sb_secret_…` (click to reveal). Goes to **Render**.
   - **Publishable key**, starts with `sb_publishable_…`. Goes to **Vercel** (CRM).

Nothing to set up in Storage: the API creates the private `documents` bucket itself on its first deploy.

---

## 2. Gmail app password (3 minutes, optional for now)

The system sends emails (approvals, reminders, the daily summary) from the owner's Gmail. Google needs an *app password* for that, not the normal password. You can skip this and add it later; everything else works without email.

1. Sign in as `cashflowloans.enquiry@gmail.com` at https://myaccount.google.com/security
2. Turn on **2-Step Verification** if it isn't on.
3. Open https://myaccount.google.com/apppasswords, name it `Cashflow CRM`, click **Create**.
4. Copy the 16-character password (spaces don't matter). Google shows it once.

---

## 3. Render Blueprint (10 minutes + about 5 minutes building)

Render runs the API, the database and the daily 09:00 reminder job. `render.yaml` in this repo describes all of it.

1. Go to https://dashboard.render.com and sign up with **GitHub**.
2. When GitHub asks which repositories Render can see, allow **daemon-spawn/cashflowloans** (or all repositories).
3. Add a payment card under **Account → Billing**. The services are paid Starter plans (about $15/month in total), because a free API goes to sleep and loses applications.
4. Click **New + → Blueprint**.
5. Choose the **cashflowloans** repository, branch **master**. Blueprint name: `cashflowloans`.
6. Render lists what it will create:
   - **cashflow-api**: web service (the API)
   - **cashflow-reminders**: cron job (daily emails at 09:00 South African time)
   - **cashflow-db**: Postgres database
7. Render then asks for the values that aren't stored in the repo. Fill them in like this:

   **cashflow-api**

   | Key | Value |
   |---|---|
   | `SUPABASE_SERVICE_ROLE_KEY` | the Supabase **secret key** (`sb_secret_…`) from step 1.5 |
   | `STAFF_EMAILS` | `cashflowloans.enquiry@gmail.com,syloncube837@gmail.com` |
   | `TURNSTILE_SECRET_KEY` | leave **empty** |
   | `SMTP_HOST` | `smtp.gmail.com` (or empty if you skipped step 2) |
   | `SMTP_USERNAME` | `cashflowloans.enquiry@gmail.com` (or empty) |
   | `SMTP_PASSWORD` | the 16-character app password from step 2 (or empty) |
   | `SMTP_FROM` | `Cashflow Loans <cashflowloans.enquiry@gmail.com>` (or empty) |

   **cashflow-reminders**: the same four `SMTP_*` values (or empty).

   These are already filled in by the Blueprint, so leave them: `SUPABASE_URL`, `DATABASE_URL`, `SECRET_KEY`, `STORAGE_BACKEND`, `CORS_ORIGINS`, `NOTIFY_EMAIL` (`cashflowloans.enquiry@gmail.com`, where new-application alerts and the daily summary go).
8. Click **Deploy Blueprint**. The database comes up first, then the API builds. Before the API starts it creates the tables and the documents bucket.
9. **Check it.** Open **cashflow-api** in the dashboard and copy its address at the top (e.g. `https://cashflow-api.onrender.com`; Render may add a suffix if the name is taken). Open that address with `/health` on the end. It should show `{"status":"ok"}`.
10. **Send the API address to the developer** for the next step.

If a deploy fails, open the service, go to **Logs**, and copy the red error.

To add or change email settings later: open the service → **Environment** → edit → **Save changes**. It redeploys by itself.

---

## 4. Vercel (after the API is live)

**Website** (the existing project, root directory `website`): **Settings → Environment Variables**, Production:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | the API address from step 3.9, no trailing slash |
| `NEXT_PUBLIC_SITE_URL` | `https://cashflowloans.co.za` (once the domain points at Vercel) |

Then **Deployments → ⋯ → Redeploy**. `NEXT_PUBLIC_*` values are built into the pages, so a redeploy is needed.

**CRM** (new project): **Add New → Project →** import `daemon-spawn/cashflowloans` → **Root Directory: `crm`** → add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | the API address from step 3.9 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qazfvknrhrcewgosljgf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the Supabase **publishable key** (`sb_publishable_…`) |

→ **Deploy**. Send the CRM's Vercel address to the developer: it has to be added to the API's `CORS_ORIGINS` so document uploads from the CRM work.

Finally, in Supabase **Authentication → URL Configuration**, set **Site URL** to the CRM's address.

---

## 5. Domains (domains.co.za)

In each Vercel project, **Settings → Domains → Add**, then add the DNS records Vercel shows at domains.co.za:

- Website project: `cashflowloans.co.za` and `www.cashflowloans.co.za`
- CRM project: `crm.cashflowloans.co.za`

`CORS_ORIGINS` already allows all three.

---

## 6. Go-live checks

1. Sign in to the CRM as the owner.
2. **Settings → Send test email.** It should arrive at cashflowloans.enquiry@gmail.com.
3. Submit a small test application on the website. It appears on the CRM's **Applications** board, and an alert email arrives.
4. Rotate the Supabase secret key (Project Settings → API Keys) since it was shared in chat, and paste the new one into `SUPABASE_SERVICE_ROLE_KEY` on Render.
