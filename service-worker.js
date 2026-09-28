/* Service worker — Nandy Nails */
const CACHE = 'nandy-v1';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg',
  './og-image.jpg',
  './assets/img/gallery/diseno-1.jpg',
  './assets/img/gallery/diseno-2.jpg',
  './assets/img/gallery/diseno-3.jpg',
  './icons/favicon-64.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return resp;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return resp;
        })
        .catch(() => cached);
    })
  );
});
