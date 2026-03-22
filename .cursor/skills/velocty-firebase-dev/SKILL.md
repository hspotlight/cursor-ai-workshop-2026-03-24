---
name: velocty-firebase-dev
description: >-
  Develops the Velocty static Firebase app—Hosting, Firestore, Auth, and Analytics
  from the browser, plain JS in public/, Jest tests, XSS-safe DOM, and Firestore
  rules alignment. Use when working in this repo, adding pages or routes, Firestore
  data, Firebase auth, or Cursor Agent tasks that need Velocty conventions.
disable-model-invocation: true
---

# Velocty Firebase + frontend

The user invoked this skill explicitly (e.g. `/velocty-firebase-dev` or `@velocty-firebase-dev`). Follow the steps below unless they already narrowed the task.

## Stack (non-negotiable)

- **No backend in-repo:** Plain HTML/CSS/JS under `public/`. Firebase JS SDK from **CDN** (compat), not npm in browser bundles.
- **Config and helpers:** `public/utils.js` initializes Firebase and exposes `auth`, `db`, and Firestore helpers. Do not duplicate `firebaseConfig` elsewhere.
- **Analytics:** `public/analytics.js` after `utils.js` when the page should log events.
- **Styles:** Shared `public/style.css`; match existing patterns (see `index.html`, `login.html`).

## Script order for every HTML page

Use the same Firebase version and order as `public/index.html`:

1. `firebase-app-compat.js`, `firebase-auth-compat.js`, `firebase-firestore-compat.js`, `firebase-analytics-compat.js`
2. `utils.js`
3. `analytics.js` (if the page should emit analytics)
4. Page script: `your-page.js`

## Firestore

- **Paths (default app data):** `users/{userId}` for profile; `users/{userId}/todos/{todoId}` for todos—see `CLAUDE.md` for field shapes.
- **Rules:** Authoritative file is `firestore.rules` in the repo. If you add collections or fields, update rules and deploy (`firebase deploy --only firestore:rules`)—do not widen access without justification.

## Auth patterns

- **Protected app page:** Mirror `public/app.js`: wait until `auth` is available, call `auth.onAuthStateChanged`; if no user, `window.location.href = '/login.html'`; otherwise wire UI and Firestore reads/writes for `request.auth.uid`.
- **Public page (e.g. login):** No redirect to login; use `public/login.js` patterns for sign-in/register only.

## Security and quality

- **XSS:** Use existing helpers (e.g. `escapeHtml` in `app.js`) or safe DOM APIs for any user-controlled strings rendered as HTML.
- **Tests:** Run `pnpm test` after behavior changes; add or extend `__tests__/*.test.js` for logic you touch.
- **Dependencies:** Avoid adding npm packages for browser code unless the user explicitly needs them; Jest stays dev-only.

## New page or route (agent checklist)

1. Confirm **basename** (e.g. `settings`) and whether the page is **protected** (default for in-app screens) or **public** (marketing, legal).
2. Add `public/<basename>.html` with the script order above; set `<title>`; reuse layout classes from `style.css` where possible.
3. Add `public/<basename>.js`:
   - **Protected:** Defer `setup` until `auth` exists (same polling pattern as `app.js` if needed), `onAuthStateChanged`, redirect to `/login.html` when logged out, then mount UI.
   - **Public:** No auth redirect; initialize UI when DOM is ready.
4. Link from existing UI only if the user asked (e.g. header nav); use root-relative paths like `/settings.html`.
5. Run `pnpm test` and spot-check with local static server (`pnpm serve` or `python3 -m http.server …` per `CLAUDE.md`).

## Commands (reference)

See `CLAUDE.md` for `pnpm serve`, `pnpm test`, `firebase deploy`, and Firebase setup—avoid duplicating long command lists here.

## Optional templates

For copy-paste consistency, see [assets/](assets/) in this skill folder.
