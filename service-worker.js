const CACHE_NAME = "adedonha-fem-v2-3";
const urlsToCache = ["./","./index.html","./styles.css","./app.js","./banco-termos.js","./manifest.json","./offline.html","./icon-192.png","./icon-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request).catch(() => caches.match("./offline.html"))));
});
