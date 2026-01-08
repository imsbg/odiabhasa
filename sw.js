const CACHE_NAME = 'odia-bhasa-single-v1';

// List of files to cache for offline use
const ASSETS_TO_CACHE = [
  './', 
  './ଓଡ଼ିଆ-ଭାଷା.html', // The specific file you requested
  // Images
  'https://imsbg.github.io/odiabhasa/images/app.png',
  'https://imsbg.github.io/odiabhasa/images/gp-odia.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Oriya:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0'
];

// 1. Install Event: Cache the specific file and assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Serve from cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request);
      })
  );
});
