const CACHE = "jp-kr-v1";
const PRECACHE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "img/foto-01.jpg", "img/foto-02.jpg", "img/foto-03.jpg", "img/foto-04.jpg", "img/foto-05.jpg", "img/foto-06.jpg", "img/foto-07.jpg", "img/foto-08.jpg", "img/foto-09.jpg", "img/foto-10.jpg", "img/foto-11.jpg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.mode === "navigate") {
    // Seite: erst Netz (aktuell), sonst Cache (offline)
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else {
    // Bilder & Co.: erst Cache, sonst Netz
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { const c = n.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return n; })));
  }
});
