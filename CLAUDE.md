# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development (serve public/ on port 3000)
python3 -m http.server 3000 --directory public

# Deploy to Firebase Hosting
firebase deploy
```

No npm dependencies needed — Firebase loads from CDN.

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

## Deployment

```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

Static files from `public/` deploy to Firebase Hosting (CDN). Auth & database are handled by Firebase backend.
