const cacheVersion = 'beta-0.1';
const urlsToPrefetch = [
  '/horse_race/',
];
// TODO: how deep does prefetch prefetchs?

this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheVersion).then((cache) => {
      return cache.addAll(urlsToPrefetch);
    })
  );
});


this.addEventListener('fetch', (event) => {
  let responsePromise = caches.match(event.request).then(response => {
    return response || fetch(event.request)
  });

  event.respondWith(responsePromise);
});
