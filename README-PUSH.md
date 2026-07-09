# Making reminders work even when the app/phone is closed

This is the real thing — a Firebase project + a scheduled Cloud Function that
sends push notifications through Firebase Cloud Messaging (FCM), plus a
service worker in this app that receives and displays them. I built and wired
all of the code; I can't create the cloud project or keys for you (that
requires a Google account and can't be done from a sandbox with no internet
access), so here's exactly what to do — about 15–20 minutes, free.

## Honest limits, read this first
- **Android (Chrome/Edge):** works well, including truly closed-app delivery, as long as the OS hasn't force-stopped the browser and battery optimization isn't aggressively killing background processes.
- **iOS/iPadOS Safari:** Web Push only works if you **Add to Home Screen** first (Settings → Share → Add to Home Screen), requires iOS 16.4+, and the OS still limits delivery timing more than Android.
- **Desktop Chrome/Edge/Firefox:** works well.
- No platform can guarantee delivery is instant or 100% reliable — that's true of every app, not just this one. The Cloud Function checks for due reminders every 5 minutes, so expect notifications within a few minutes of the actual time, not to-the-second.
- I was not able to test this end-to-end myself (this sandbox has no internet access and no Google account), so treat the first real test on your device as the actual verification step.

## 1. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. "nexus-ai") → follow the prompts (Google Analytics optional, skip it).
2. Once created, click **Build → Firestore Database → Create database** → start in **Production mode** → pick a region close to you.
3. Click **Build → Cloud Messaging** — nothing to configure here yet, just confirm it's enabled.

## 2. Register a Web app and get your config
1. Project Settings (gear icon) → **General** → scroll to "Your apps" → click the **Web** icon (`</>`) → register app (any nickname) → you do **not** need Firebase Hosting at this step, skip it.
2. Copy the `firebaseConfig` object shown.
3. Paste those values into `js/firebase-config.js` in this project, replacing the placeholders.

## 3. Generate your Web Push certificate (VAPID key)
1. Project Settings → **Cloud Messaging** tab → scroll to **Web configuration** → **Web Push certificates** → click **Generate key pair**.
2. Copy the key string shown and paste it into `vapidKey` in `js/firebase-config.js`.

## 4. Enable Anonymous Authentication (used only to secure your Firestore data)
1. Build → **Authentication** → **Get started** → **Sign-in method** tab → enable **Anonymous**.

## 5. Install the Firebase CLI and deploy
You'll need [Node.js](https://nodejs.org) installed on your computer first.

```bash
npm install -g firebase-tools
firebase login

cd nexus-ai
cp .firebaserc.example .firebaserc
# edit .firebaserc and put your real project ID in place of YOUR_PROJECT_ID

# Cloud Functions need the "Blaze" (pay-as-you-go) plan — required for scheduled
# functions. The free tier easily covers personal use (a few cents/month at most,
# usually $0). You'll be prompted to upgrade in the Firebase console if needed:
# https://console.firebase.google.com/project/_/usage/details

firebase deploy --only firestore:rules,firestore:indexes
cd functions && npm install && cd ..
firebase deploy --only functions
firebase deploy --only hosting
```

After the last command, Firebase prints your live URL
(`https://YOUR_PROJECT_ID.web.app`). Open **that** URL on your phone (not the
local file) — push notifications require HTTPS, which Firebase Hosting gives
you automatically.

Also edit `functions/index.js` and replace `YOUR_PROJECT_ID` in the `APP_URL`
constant with your real hosting URL, then redeploy functions
(`firebase deploy --only functions`).

## 6. Turn it on in the app
1. Open your deployed URL, finish onboarding.
2. Go to **Profile → Settings & Reminders**.
3. Turn on **Background push notifications**, choose which offsets you want (1 week / 1 day / 1 hour / 30 min before), tap **Save preferences**.
4. Your browser will ask for notification permission — allow it.
5. That's it — the app writes reminder documents to Firestore for every upcoming memory, and the Cloud Function sends the push when they're due.

## How it fits together
```
You type in chat → memory saved locally → also synced to Firestore "reminders" collection
                                                          ↓
                        Cloud Function (runs every 5 min, independent of your device)
                                                          ↓
                         Firebase Cloud Messaging → your browser's push service
                                                          ↓
                          sw.js "push" event → shows a real system notification
```

## Troubleshooting
- **"Add your Firebase keys" toast:** you haven't edited `js/firebase-config.js` yet.
- **No token / permission denied:** check your browser's site settings — notifications may be blocked. On iOS, make sure you added the app to your Home Screen first.
- **Nothing arrives after 5–10 minutes:** check the Cloud Function logs at `firebase functions:log` or in the Firebase console under Functions → Logs, to see if it's finding/sending reminders.
- **Composite index error in the logs:** Firestore will print a direct link to auto-create the missing index the first time the function runs — click it, or just run `firebase deploy --only firestore:indexes` again.
