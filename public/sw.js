const CACHE_NAME = 'casanova-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Always fetch API routes fresh
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first for pages, cache-first for static assets
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) =>
          cached || new Response('You\'re offline. Casanova needs internet to coach you.', {
            headers: { 'Content-Type': 'text/html' },
          })
        )
      )
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
    )
  );
});
