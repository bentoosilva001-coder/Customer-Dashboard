const K = 'lumx-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(K).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== K).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(x => { const y = x.clone(); caches.open(K).then(c => c.put(r, y)); return x; })
      .catch(() => caches.match(r).then(m => m || caches.match('./index.html')))
  );
});
