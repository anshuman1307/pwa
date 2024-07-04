const CACHE_NAME = 'cached-assets';
const assets = [
  '/pwa/',
  '/pwa/index.html',
  '/pwa/js/ui.js',
  '/pwa/js/materialize.min.js',
  '/pwa/css/styles.css',
  '/pwa/css/materialize.min.css',
  '/pwa/img/adidas.png',
  '/pwa/img/england.png',
  '/pwa/img/football.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', function (event) {
  event.respondWith(
      fetch(event.request).catch(function() {
          return caches.match(event.request)
      })
  )
});

// Service worker registration
self.addEventListener('push', event => {
  const data = event.data.json(); // Extract JSON data from the push notification
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/img/icons/icon128.png' // Optional: Customize notification icon
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Handle notification click event, e.g., open a specific URL
  clients.openWindow('/index.html');
});


// Example: Cache images and other resources
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => caches.match('/index.html')) // Example offline fallback
  );
});

// Example: Cache version cleanup
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});


