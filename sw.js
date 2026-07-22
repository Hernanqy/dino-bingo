var CACHE_NAME = "bingo-prehistorico-v18";

var APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./effects.css",
  "./theme-extinction.css",
  "./app.js",
  "./manifest.json",
  "./public/icon-192.png",
  "./public/icon-512.png",
  "./public/cards/b1.png",
  "./public/cards/b2.png",
  "./public/cards/b3.png",
  "./public/cards/b4.png",
  "./public/cards/b5.png",
  "./public/cards/b6.png",
  "./public/cards/b7.png",
  "./public/cards/b8.png",
  "./public/cards/b9.png"
  "./layout-pantalla.css",
  "./public/background-prehistorico.jpg",
  "./ajustes-finales.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }

          return Promise.resolve();
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (networkResponse) {
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

















