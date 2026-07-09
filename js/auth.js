/* =====================================================================
   NEXUS AI — AUTHENTICATION
   Uses dynamic import() for Firebase Auth to keep initial load fast.
   ===================================================================== */

const NexusAuth = (function(){
  const FB_VERSION = '10.14.1';
  const CDN = (name) => `https://www.gstatic.com/firebasejs/${FB_VERSION}/${name}`;
  
  let auth = null;
  let currentUser = null;
  let onAuthStateChangedCallback = null;

  async function loadAuth() {
    if (auth) return auth;
    if (!FIREBASE_CONFIGURED) throw new Error('Firebase is not configured yet — edit js/firebase-config.js');
    
    const [appMod, authMod] = await Promise.all([
      import(CDN('firebase-app.js')),
      import(CDN('firebase-auth.js'))
    ]);
    
    let app;
    try {
      app = appMod.getApp();
    } catch (e) {
      app = appMod.initializeApp(firebaseConfig);
    }

    auth = authMod.getAuth(app);
    return { auth, authMod };
  }

  async function init(callback) {
    onAuthStateChangedCallback = callback;
    if (!FIREBASE_CONFIGURED) {
      // If Firebase isn't configured, fallback to offline "guest"
      currentUser = { uid: 'guest', email: 'guest@local', displayName: 'Guest' };
      callback(currentUser);
      return;
    }
    try {
      const { auth, authMod } = await loadAuth();
      authMod.onAuthStateChanged(auth, (user) => {
        // Only treat non-anonymous users as logged in for the UI
        if (user && !user.isAnonymous) {
          currentUser = user;
        } else {
          currentUser = null;
        }
        if (onAuthStateChangedCallback) onAuthStateChangedCallback(currentUser);
      });
    } catch (e) {
      console.error('Failed to init auth', e);
      callback(null);
    }
  }

  async function login(email, password) {
    if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
    const { auth, authMod } = await loadAuth();
    const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function signup(email, password, name) {
    if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
    const { auth, authMod } = await loadAuth();
    const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
    await authMod.updateProfile(cred.user, { displayName: name });
    return cred.user;
  }

  async function logout() {
    if (!FIREBASE_CONFIGURED) return;
    const { auth, authMod } = await loadAuth();
    await authMod.signOut(auth);
  }

  function getUser() { return currentUser; }

  return { init, login, signup, logout, getUser };
})();
