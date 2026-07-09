/* =====================================================================
   NEXUS AI — SERVICE WORKER
   1) Caches the app shell so it installs and opens offline (real PWA).
   2) Listens for native Web Push events and shows a system notification —
      this is what lets a reminder arrive even if the app/tab is closed,
      as long as the OS has delivered the push to the browser in the background.
   ===================================================================== */

const CACHE_NAME = 'nexus-ai-v5';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/icons.js',
  './js/data.js',
  './js/store.js',
  './js/components.js',
  './js/views.js',
  './js/router.js',
  './js/firebase-config.js',
  './js/push.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});

/* ---------------- REAL PUSH NOTIFICATIONS ----------------
   This fires when the browser receives a push from Firebase Cloud Messaging's
   backend, even if this tab/app is not open — as long as the browser process
   or the OS's push service is reachable (see README-PUSH.md for platform limits). */
self.addEventListener('push', (event) => {
  let payload = { title: 'Nexus AI', body: 'You have a reminder.' };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    try { payload.body = event.data.text(); } catch (e2) {}
  }
  const title = payload.title || payload.notification?.title || 'Nexus AI';
  const body = payload.body || payload.notification?.body || 'You have a reminder.';
  const url = (payload.data && payload.data.url) || './index.html#home';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [120, 60, 120],
      data: { url },
      tag: payload.tag || 'nexus-reminder',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './index.html#home';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) { client.navigate(url); return client.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
