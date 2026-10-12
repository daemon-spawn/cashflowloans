# Cashflow Loans

Website, CRM and API for Cashflow Loans — secured and unsecured short-term loans in South Africa.

## Structure

```
cashflowloans/
├── website/            Next.js public site → Vercel (cashflowloans.co.za)
├── crm/                Next.js staff CRM → Vercel (crm.cashflowloans.co.za)
├── backend/            Flask REST API + Postgres migrations → Render
├── packages/
│   ├── core/           Shared TS: loan rules, company details, statuses, form schemas
│   └── ui/             Shared shadcn/ui components + brand theme (money green)
├── docs/               Architecture and decisions
├── legacy/             Old site, forms app, CRM and backend — reference only, to be deleted
└── render.yaml         Render Blueprint (API + database)
```

Inside each Next.js app:

```
src/
├── app/                Routes only — pages stay thin and compose components
├── components/
│   ├── layout/         Header, Footer, Sidebar… (one folder per component)
│   ├── sections/       Page sections (Hero, LoanCalculator, FaqList…)
│   ├── forms/          Form components and fields
│   ├── motion/         GSAP / Lenis wrappers (website)
│   └── shared/         Small building blocks (Container, PageTitle…)
├── content/            Copy and data (FAQ, blog) — website
└── lib/                API clients, helpers, config
```

Every component lives in its own folder:

```
components/sections/LoanCalculator/
├── LoanCalculator.tsx
├── LoanCalculator.module.css   # optional custom CSS
└── index.ts                    # export { LoanCalculator } from "./LoanCalculator";
```

Import through the folder: `import { LoanCalculator } from "@/components/sections/LoanCalculator"`.
shadcn primitives (Button, Input, Card…) live flat in `packages/ui/src/components/` so `shadcn add` keeps working.

## Getting started

Requirements: Node 22, pnpm 10, Python 3.13, Postgres 16.

```bash
pnpm install
cp website/.env.example website/.env.local
cp crm/.env.example crm/.env.local
cp backend/.env.example backend/.env

# API
cd backend
python -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/flask --app wsgi db upgrade
.venv/bin/flask --app wsgi run --port 5000

# Frontends (from the repo root)
pnpm dev:website   # http://localhost:3000
pnpm dev:crm       # http://localhost:3001
```

## Checks

```bash
pnpm typecheck && pnpm lint && pnpm build
cd backend && .venv/bin/ruff check . && .venv/bin/pytest
```

## Adding shadcn components

```bash
cd packages/ui && pnpm dlx shadcn@latest add dialog
```
