/* =====================================================================
   FIREBASE CONFIG — paste your real project values here.
   Get these from: Firebase Console → Project settings → General → Your apps → Web app
   Get vapidKey from: Firebase Console → Project settings → Cloud Messaging → Web Push certificates
   ===================================================================== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  vapidKey: "YOUR_VAPID_PUBLIC_KEY"
};

// Do not edit below — the app uses this flag to detect whether you've configured Firebase yet.
const FIREBASE_CONFIGURED = firebaseConfig.apiKey !== "YOUR_API_KEY" && !!firebaseConfig.apiKey;

// Works in both regular <script> context (window) and inside the service worker (self)
try{
  if (typeof self !== 'undefined') { self.firebaseConfig = firebaseConfig; self.FIREBASE_CONFIGURED = FIREBASE_CONFIGURED; }
}catch(e){}
