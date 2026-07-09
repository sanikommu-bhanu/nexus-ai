/* =====================================================================
   NEXUS AI — PUSH / BACKGROUND REMINDERS
   Loaded as a normal <script> but uses dynamic import() to pull the
   Firebase modular SDK from Google's CDN only when actually needed —
   so the app works perfectly with zero network dependency until you
   configure Firebase in js/firebase-config.js.
   ===================================================================== */

const NexusPush = (function(){
  const FB_VERSION = '10.14.1';
  const CDN = (name) => `https://www.gstatic.com/firebasejs/${FB_VERSION}/${name}`;

  let swReg = null;
  let fb = null; // { app, auth, db, messaging, fns }
  let token = null;

  const SYNCED_KEY = 'nexus_reminder_ids_v1';
  const TOKEN_KEY = 'nexus_fcm_token_v1';

  async function registerServiceWorker(){
    if(!('serviceWorker' in navigator)) return null;
    try{
      swReg = await navigator.serviceWorker.register('./sw.js');
      return swReg;
    }catch(e){ console.warn('SW registration failed', e); return null; }
  }

  async function loadFirebase(){
    if(fb) return fb;
    if(!FIREBASE_CONFIGURED) throw new Error('Firebase is not configured yet — edit js/firebase-config.js');
    const [{ initializeApp }, authMod, fsMod, msgMod] = await Promise.all([
      import(CDN('firebase-app.js')),
      import(CDN('firebase-auth.js')),
      import(CDN('firebase-firestore.js')),
      import(CDN('firebase-messaging.js')),
    ]);
    const app = initializeApp(firebaseConfig);
    const auth = authMod.getAuth(app);
    await authMod.signInAnonymously(auth).catch(e=> console.warn('Anonymous sign-in failed', e));
    const db = fsMod.getFirestore(app);
    let messaging = null;
    try{ messaging = msgMod.isSupported && await msgMod.isSupported() ? msgMod.getMessaging(app) : null; }
    catch(e){ messaging = null; }
    fb = { app, auth, db, messaging, mods: { authMod, fsMod, msgMod } };
    return fb;
  }

  async function status(){
    return {
      configured: FIREBASE_CONFIGURED,
      permission: ('Notification' in window) ? Notification.permission : 'unsupported',
      hasToken: !!(token || localStorage.getItem(TOKEN_KEY)),
      swReady: !!swReg,
    };
  }

  async function enable(){
    if(!FIREBASE_CONFIGURED){ throw new Error('not_configured'); }
    if(!('Notification' in window)) throw new Error('unsupported');
    await registerServiceWorker();
    const perm = await Notification.requestPermission();
    if(perm !== 'granted') throw new Error('permission_denied');

    const { messaging, db, mods } = await loadFirebase();
    if(!messaging) throw new Error('messaging_unsupported');

    const swRegistration = swReg || await navigator.serviceWorker.ready;
    token = await mods.msgMod.getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: swRegistration,
    });
    if(!token) throw new Error('no_token');
    localStorage.setItem(TOKEN_KEY, token);

    await mods.fsMod.setDoc(mods.fsMod.doc(db, 'deviceTokens', token), {
      token,
      lastSeen: mods.fsMod.serverTimestamp(),
      userAgent: navigator.userAgent,
    });

    await syncAllReminders();
    return token;
  }

  async function disable(){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SYNCED_KEY);
    token = null;
  }

  /* Recompute reminder documents in Firestore from current local memories + prefs.
     Cloud Function (functions/index.js) polls this collection every 5 minutes
     and sends a push through FCM when a reminder's sendAt time has passed. */
  async function syncAllReminders(){
    if(!FIREBASE_CONFIGURED) return;
    const savedToken = token || localStorage.getItem(TOKEN_KEY);
    if(!savedToken) return; // user hasn't enabled push yet

    const { db, mods } = await loadFirebase();
    const s = Store.get();
    const prefs = s.reminderPrefs;
    const offsets = [
      { key:'w1', ms: 7*24*60*60*1000, on: prefs.w1, label:'1 week' },
      { key:'d1', ms: 1*24*60*60*1000, on: prefs.d1, label:'1 day' },
      { key:'h1', ms: 60*60*1000, on: prefs.h1, label:'1 hour' },
      { key:'m30', ms: 30*60*1000, on: prefs.m30, label:'30 minutes' },
    ];

    const desired = {}; // id -> doc data
    const now = Date.now();
    s.memories.filter(m=> m.kind==='event' || m.kind==='task').forEach(m=>{
      const eventTime = new Date(m.date).getTime();
      offsets.filter(o=>o.on).forEach(o=>{
        const sendAt = eventTime - o.ms;
        if(sendAt > now){
          const id = `${m.id}_${o.key}`;
          desired[id] = {
            title: 'Nexus AI',
            body: `${m.title} — ${o.label} from now`,
            sendAt,
            sent: false,
            memoryId: m.id,
            token: savedToken,
          };
        }
      });
    });

    let prevIds = [];
    try{ prevIds = JSON.parse(localStorage.getItem(SYNCED_KEY) || '[]'); }catch(e){}
    const nextIds = Object.keys(desired);

    const toDelete = prevIds.filter(id => !desired[id]);
    await Promise.all(toDelete.map(id => mods.fsMod.deleteDoc(mods.fsMod.doc(db, 'reminders', id)).catch(()=>{})));

    await Promise.all(Object.entries(desired).map(([id, data]) =>
      mods.fsMod.setDoc(mods.fsMod.doc(db, 'reminders', id), {
        ...data,
        sendAt: mods.fsMod.Timestamp.fromMillis(data.sendAt),
      })
    ));

    localStorage.setItem(SYNCED_KEY, JSON.stringify(nextIds));
  }

  return { registerServiceWorker, enable, disable, status, syncAllReminders };
})();
