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

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (start in test mode initially)
3. Enable **Authentication** → Email/Password provider
4. Create a **service account** (Project Settings → Service Accounts → Generate new private key) and save as JSON
5. Copy `.env.example` to `.env` and fill in:
   - `FIREBASE_PROJECT_ID` — Your Firebase project ID
   - `FIREBASE_SERVICE_ACCOUNT_KEY` — Paste the entire service account JSON as a string

6. In `public/utils.js`, update the `firebaseConfig` object with your **web app config** (Project Settings → General → Your apps → Web SDK config)

## Architecture

**Full-stack app:** Express backend + vanilla JS frontend, deployable to Vercel as a serverless function.

**Backend** (`api/` + `src/`) follows a strict 3-layer pattern:
- `src/controllers/` — HTTP handlers; parse requests, call services, return responses
- `src/services/` — Business logic; validation, orchestration, no direct DB access
- `src/repositories/` — All Firestore queries; enforce per-user data isolation here

**Database:** Firestore with collection structure:
```
users/
  {userId}/
    email: string
    createdAt: timestamp
  {userId}/todos/
    {todoId}: { title, completed, createdAt }
```

**Frontend** (`public/`) is plain HTML/CSS/JS with no build step:
- `utils.js` — Firebase initialization; shared `apiFetch()` wrapper that auto-attaches the Firebase ID token
- `login.js` — Handles register/login form toggle; uses Firebase SDK for auth
- `app.js` — Todo CRUD and DOM rendering

**Auth flow:**
1. Frontend calls `firebase.auth().createUserWithEmailAndPassword()` or `signInWithEmailAndPassword()`
2. Firebase SDK manages session and provides ID token
3. Frontend's `getToken()` retrieves the current user's ID token from Firebase
4. `apiFetch()` attaches token as `Authorization: Bearer <token>`
5. Backend's `auth.middleware.js` verifies the Firebase ID token using Admin SDK
6. `userId` (Firebase UID) is attached to request, used by repositories for scoping queries

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | — | Create user in Firebase (optional backend flow) |
| GET | `/api/todos` | Firebase ID token | Fetch all todos for authenticated user |
| POST | `/api/todos` | Firebase ID token | Create new todo |
| PATCH | `/api/todos/:id` | Firebase ID token | Update todo (title or completed status) |
| DELETE | `/api/todos/:id` | Firebase ID token | Delete todo |

## Deployment

Vercel config in `vercel.json` rewrites `/api/*` to `api/index.js`. The same `api/index.js` serves the `public/` folder locally but not on Vercel (static files served via CDN there).
