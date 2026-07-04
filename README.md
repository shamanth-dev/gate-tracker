# GATE CSE Syllabus Tracker

React + Vite + Firebase (Google login, Firestore sync), deployed on GitHub Pages.

## Project structure

```
gate-tracker/
├── index.html
├── package.json
├── vite.config.js          ← base must match your repo name
├── firestore.rules          ← paste into Firebase console
├── .env.example             ← copy to .env, fill in values
├── .gitignore
├── .github/workflows/deploy.yml
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx              ← the whole app (auth + tracker)
    ├── firebase/firebase.js
    └── syllabus/syllabus.js ← default GATE syllabus seed
```

Note: `importSyllabus.js` from the earlier version is intentionally gone.
It pushed data into flat `subjects`/`topics` collections, which this
per-user-document model does not use. New users are seeded automatically
by App.jsx on first sign-in.

## Data model

One Firestore document per user:

```
users/{uid}
  syllabus: { "Subject name": ["topic", "topic", ...], ... }
  data:     { "Subject::Topic": { status, pyq, note }, ... }
```

## Setup (local first)

1. `npm install`
2. Copy `.env.example` to `.env`, fill in your Firebase config
   (Firebase console → Project settings → General → Your apps).
3. Firebase console → Authentication → Sign-in method → enable **Google**.
4. Firebase console → Firestore Database → create database.
5. Firestore → Rules → paste the contents of `firestore.rules` → Publish.
6. `npm run dev` → sign in with Google → toggle a topic status.
7. Verify in Firestore that `users/{your-uid}` exists and updates.

Do not move on to deployment until step 7 works.

## Deploy to GitHub Pages

1. In `vite.config.js`, set `base` to `"/<your-repo-name>/"`.
2. Push the repo to GitHub (main branch), including
   `.github/workflows/deploy.yml`.
3. GitHub repo → Settings → Secrets and variables → Actions →
   add all six `VITE_FB_*` secrets (same values as `.env`).
4. GitHub repo → Settings → Pages → Source → **GitHub Actions**.
5. Firebase console → Authentication → Settings → Authorized domains →
   add `<your-username>.github.io`.
6. Push to main (or run the workflow manually). Your app will be at
   `https://<your-username>.github.io/<repo-name>/`.

## Troubleshooting

- **auth/unauthorized-domain** → step 5 above is missing.
- **Missing or insufficient permissions** → rules not published, or you
  are writing outside `users/{uid}`.
- **Blank page on Pages but works locally** → `base` in vite.config.js
  doesn't match the repo name.
- **Popup blocked on sign-in** → the app automatically falls back to
  redirect sign-in; just let the redirect complete.
