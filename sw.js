self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('jobportal-static-v2')
      .then((cache) => cache.add('/static/logo.png'))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('jobportal-') && key !== 'jobportal-static-v2')
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (
    e.request.method !== 'GET'
    || e.request.mode === 'navigate'
    || new URL(e.request.url).origin !== self.location.origin
  ) {
    return;
  }

  if (new URL(e.request.url).pathname === '/static/logo.png') {
    e.respondWith(
      caches.open('jobportal-static-v2')
        .then((cache) => cache.match(e.request))
        .then((response) => response || fetch(e.request))
    );
  }
});
