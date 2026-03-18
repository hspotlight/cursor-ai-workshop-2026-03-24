# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development (with file watching)
pnpm dev

# Production
pnpm start
```

No test framework is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_KEY` — Service role key (backend only, never expose to frontend)
- `JWT_SECRET` — Long random string for signing JWTs

Run `schema.sql` in the Supabase SQL editor to initialize the database.

## Architecture

**Full-stack app:** Express backend + vanilla JS frontend, deployable to Vercel as a serverless function.

**Backend** (`api/` + `src/`) follows a strict 3-layer pattern:
- `src/controllers/` — HTTP handlers; parse requests, call services, return responses
- `src/services/` — Business logic; validation, orchestration, no direct DB access
- `src/repositories/` — All Supabase queries; enforce per-user data isolation here

**Frontend** (`public/`) is plain HTML/CSS/JS with no build step:
- `utils.js` — Shared `apiFetch()` wrapper that auto-attaches the JWT bearer token; token stored in localStorage
- `login.js` — Handles register/login form toggle and submission
- `app.js` — Todo CRUD and DOM rendering

**Auth flow:** JWT issued on login/register → stored in localStorage → sent as `Authorization: Bearer <token>` → verified by `src/middleware/auth.middleware.js`, which attaches `userId` to every request → repositories use `userId` to scope all queries.

## API Routes

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/todos` | JWT |
| POST | `/api/todos` | JWT |
| PATCH | `/api/todos/:id` | JWT |
| DELETE | `/api/todos/:id` | JWT |

## Deployment

Vercel config in `vercel.json` rewrites `/api/*` to `api/index.js`. The same `api/index.js` serves the `public/` folder locally but not on Vercel (static files served via CDN there).
