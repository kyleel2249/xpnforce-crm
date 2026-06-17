// /sw.js — XPNFORCE Service Worker
const CACHE_NAME    = 'xpnforce-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/utils/eventbus.js',
  './js/modules/auth.js',
  './js/modules/router.js',
  './js/modules/nav.js',
  './js/modules/datastore.js',
  './js/modules/ai-assistant.js',
  './js/modules/notifications.js',
  './js/modules/toast.js',
  './js/pages/_helpers.js',
  './js/pages/dashboard.js',
  './js/pages/contacts.js',
  './js/pages/companies.js',
  './js/pages/pipeline.js',
  './js/pages/support.js',
  './js/pages/campaigns.js',
  './js/pages/workflows.js',
  './js/pages/tasks.js',
  './js/pages/invoices.js',
  './js/pages/users.js',
  './js/pages/settings.js',
  './js/pages/ai-hub.js',
  './js/pages/activities.js',
  './js/pages/segments.js',
  './js/pages/journeys.js',
  './js/pages/live-chat.js',
  './js/pages/knowledge.js',
  './js/pages/forecasting.js',
  './js/pages/reports.js',
  './js/pages/integrations.js',
  './js/pages/team-chat.js',
  './js/pages/analytics.js',
  './manifest.json',
  './assets/icons/logo.svg',
];

// ── Install ──────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing XPNFORCE Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS.filter(Boolean)))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Cache install partial failure:', err))
  );
});

// ── Activate ─────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch Strategy ───────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin API calls, Firebase, Anthropic
  if (request.method !== 'GET') return;
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('anthropic') ||
      url.hostname.includes('cloudflare') ||
      url.hostname.includes('gstatic')) return;

  // Network-first for HTML (always fresh)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, fonts, icons)
  if (
    url.pathname.includes('/js/') ||
    url.pathname.includes('/css/') ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.hostname.includes('fonts.googleapis') ||
    url.hostname.includes('fonts.gstatic')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first for everything else, fallback to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
  );
});

// ── Background Sync (future: queue offline mutations) ────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-crm-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // Placeholder: sync queued IndexedDB writes to Firebase
  console.log('[SW] Background sync: CRM data');
}

// ── Push Notifications ───────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'XPNFORCE', {
      body: data.body || 'You have a new notification',
      icon: 'assets/icons/icon-192.png',
      badge: 'assets/icons/icon-72.png',
      data: data,
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length) return clientList[0].focus();
      return clients.openWindow('./');
    })
  );
});