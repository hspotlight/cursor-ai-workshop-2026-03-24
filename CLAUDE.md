# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (Jest for testing)
pnpm install
# or: npm install

# Local development (serve public/ on port 3000)
python3 -m http.server 3000 --directory public

# Run tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Deploy to Firebase Hosting
firebase deploy
```

Firebase SDK loads from CDN. Jest is the only npm dependency (for testing).

## Setup

**Firebase is already configured.** The web app config is in `public/utils.js`.

To use your own Firebase project instead:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (start in test mode)
3. Enable **Authentication** → Email/Password provider
4. Update the `firebaseConfig` in `public/utils.js` with your project's credentials (from Project Settings → Your apps → Web)

No backend, no secret keys, no server-side setup needed.

## Architecture

**Frontend-only app:** Plain HTML/CSS/JS files, Firebase SDK loads from CDN.

**Structure:**
- `public/utils.js` — Firebase initialization + Firestore helper functions
- `public/login.js` — Uses Firebase Auth for sign-up/login
- `public/app.js` — Todo CRUD with Firestore
- `public/login.html`, `index.html` — UI

**Auth flow:**
1. User signs up/logs in via Firebase Auth (browser handles password hashing)
2. Firebase keeps user session in browser
3. App reads `auth.currentUser` to get the logged-in user

**Database structure (Firestore):**
```
users/
  {userId}/
    email: string
    createdAt: timestamp
  {userId}/todos/
    {todoId}: { title, completed, createdAt }
```

**Firestore Security Rules** (set in Firebase Console → Firestore → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /todos/{todoId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

This ensures users can only read/write their own data.

## Testing

**Test files** in `__tests__/`:
- `app.test.js` — Tests for UI helpers (escapeHtml, getCurrentTodos)
- `utils.test.js` — Tests for validation logic

**Run tests:**
```bash
pnpm test              # Run once
pnpm test:watch       # Run and re-run on changes
```

**What's tested:**
- HTML escaping (prevents XSS vulnerabilities)
- Form validation (empty title checks)
- DOM parsing (extracting todos from the list)
- Whitespace trimming

**Adding new tests:** Create files matching `**/*.test.js` in `__tests__/` and they'll auto-discover.

## Deployment

**First time setup:**
```bash
npm install -g firebase-tools
firebase login
firebase init
# Select: Firestore, Hosting
# Use existing project: velocty-ab097
```

**Deploy (rules + app):**
```bash
firebase deploy
```

**Deploy only rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy only hosting:**
```bash
firebase deploy --only hosting
```

**Security Rules** (`firestore.rules`):
- Users can only read/write their own user document
- Users can only read/write their own todos
- All other access denied

The rules ensure data isolation—each user can only see/modify their own todos.
