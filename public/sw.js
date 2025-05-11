
// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Optionally, precache assets here
  // event.waitUntil(
  //   caches.open('app-v1-cache').then((cache) => {
  //     return cache.addAll([
  //       '/',
  //       // other important assets
  //     ]);
  //   })
  // );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Optionally, clean up old caches here
  // event.waitUntil(
  //   caches.keys().then((cacheNames) => {
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         if (cacheName !== 'app-v1-cache') {
  //           return caches.delete(cacheName);
  //         }
  //       })
  //     );
  //   })
  // );
  return self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', (event) => {
  // A basic fetch handler is required for the app to be installable.
  // This simple strategy tries to fetch from network first,
  // then falls back to cache if network fails (basic offline support).
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, try to serve from cache.
      // return caches.match(event.request).then((response) => {
      //   return response || caches.match('/offline.html'); // Fallback to an offline page
      // });
      // For now, just let it fail if network fails, or provide a very generic offline response.
      // This handler is primarily to satisfy PWA install criteria.
      // A more robust strategy would involve caching important assets.
      return new Response("Network error. You might be offline.", {
        headers: { 'Content-Type': 'text/plain' },
        status: 503 // Service Unavailable
      });
    })
  );
});
