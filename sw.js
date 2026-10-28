const C = '30kartor-v1';
const A = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(C).then((c) => Promise.allSettled(A.map((u) => c.add(u)))));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) {
    // egna filer: nätverket först så att uppdateringar kommer fram, cache som reserv
    e.respondWith(fetch(e.request).then((r) => {
      const k = r.clone();
      caches.open(C).then((c) => c.put(e.request, k));
      return r;
    }).catch(() => caches.match(e.request)));
  } else if (u.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
