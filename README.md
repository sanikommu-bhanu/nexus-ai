# Nexus AI — Your Second Brain

A fully working, offline-first prototype of the Nexus AI concept: premium UI, real interactions, local persistence, and genuine browser-native voice features. No build step — open `index.html` and it runs.

## Run it
- **Easiest:** double-click `index.html` (or drag it into a browser tab).
- **Recommended:** serve it locally so browser mic/voice permissions behave normally:
  ```
  cd nexus-ai
  python3 -m http.server 8080
  # visit http://localhost:8080
  ```
- Works great on desktop Chrome/Edge/Safari. On mobile Safari/Chrome, add to home screen for an app-like feel.

## What's genuinely working right now
- Full onboarding → dashboard → memory → AI chat → explore → calendar → documents → analytics → profile/settings flow, all client-side routed.
- **Real local persistence** — everything you add survives a refresh (browser `localStorage`).
- **Real on-device "AI" extraction** — a keyword/date heuristic parser reads free text ("I registered for Smart India Hackathon, team Nova") and turns it into a structured memory (category, org, date, team) with zero external API calls.
- **Real voice** — "Hear today's briefing" uses the browser's built-in `speechSynthesis`; the mic button in chat uses `SpeechRecognition` where the browser supports it (Chrome/Edge).
- Real file uploads to the Document Vault (metadata + genuine downloadable copies of files you upload this session).
- Calendar view built from your memories, `.ics` export per event, JSON data export/backup, full reset.
- **Real installable PWA** — `manifest.json` + `sw.js` make this installable to a home screen and usable offline (app shell is cached).
- **Real background push notifications** — once you connect a free Firebase project (see `README-PUSH.md`), reminders are delivered through Firebase Cloud Messaging by a scheduled Cloud Function, and arrive even when the app is fully closed. This is code I built and wired end-to-end; it needs your own Firebase keys to actually turn on (see below) since I can't create cloud credentials on your behalf.

## Turning on real background push (~15 min, free)
Step-by-step instructions are in **`README-PUSH.md`** — create a Firebase project, paste your keys into `js/firebase-config.js`, deploy the included Cloud Function, done. Until you do that, the app runs perfectly in "local demo" mode: reminders and voice briefings still work great while the app is open, they just won't wake your phone while it's closed.

## What's intentionally mocked (and why)
The original brief also asked for Gemini, Gmail/GitHub/LinkedIn/Calendar/Drive OAuth, and live opportunity scraping from 15+ external platforms. None of that can work without your own API keys/OAuth client IDs for each provider. So in this build:
- Login/"Connect accounts" toggles are real UI, but don't perform real OAuth.
- The Explore feed is realistic mock data shaped like Unstop/Devfolio/MLH results, not a live scrape.
- The AI chat's entity extraction is a local heuristic parser, not a live Gemini call.

## Wiring in the rest
1. **Gemini for real NLU:** replace `parseMemoryFromText()` in `js/components.js` with a `fetch()` to a small backend (a Cloud Function is a natural fit, same project you just set up) that calls the Gemini API using a server-held key.
2. **Firestore as the source of truth:** swap `js/store.js`'s localStorage calls for Firestore reads/writes once you're comfortable with the Firebase setup from `README-PUSH.md`.
3. **Gmail/Calendar/Drive/GitHub/LinkedIn:** these need OAuth — extend the same Cloud Functions backend to handle the OAuth dance and store tokens server-side, never in the browser.

## File structure
```
nexus-ai/
  index.html
  manifest.json           — PWA install metadata
  sw.js                    — service worker: offline caching + push notifications
  css/style.css            — full design system (tokens, components)
  icons/                   — generated app icons (192/512/maskable)
  js/icons.js              — inline SVG icon set
  js/data.js               — seed data + date helpers
  js/store.js              — localStorage-backed reactive store
  js/components.js         — reusable UI + the local NLU parser
  js/views.js               — every screen
  js/router.js              — hash-based router
  js/firebase-config.js     — paste your Firebase project keys here
  js/push.js                 — Firebase Cloud Messaging client + reminder sync
  js/main.js                — event delegation, speech APIs, actions
  functions/index.js        — Cloud Function: sends due reminders via FCM (deploy this)
  firestore.rules / firestore.indexes.json / firebase.json / .firebaserc.example
  README-PUSH.md            — step-by-step deployment guide for real push
```

Everything is vanilla HTML/CSS/JS — no build tooling required, easy to hand to any engineer to extend or port into React later.
