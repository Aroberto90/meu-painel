// Funciona sem internet: guarda o app no celular. As notícias tentam a internet primeiro.
const CACHE = 'meu-painel-__VERSAO__';
const APP = ['./', 'index.html', 'app.js', 'dados.js', 'estilo.css', 'manifest.webmanifest', 'icones/icone-180.png', 'icones/icone-192.png', 'icones/icone-512.png'];

self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('meu-painel-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // notícias: internet primeiro, cópia guardada se estiver sem conexão
  if (url.pathname.endsWith('/noticias.json')) {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); return r; }).catch(() => caches.match(req)));
    return;
  }
  // app, fontes e a biblioteca de planilha: guardado primeiro, internet se não tiver
  e.respondWith(caches.match(req, { ignoreSearch: url.origin === location.origin }).then((r) => r || fetch(req).then((resp) => {
    if (resp.ok && (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(url.host))) { const c = resp.clone(); caches.open(CACHE).then((x) => x.put(req, c)); }
    return resp;
  })));
});
