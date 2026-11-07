// Offline cache for the GYRUS SULCUS Board. Cache-first; a new version replaces the old cache.
const CACHE='gsboard-da63f574a0d2';
const FILES=["bio/alveoli.svg", "bio/animal-cell.svg", "bio/bacterial-cell.svg", "bio/brain-lobes.svg", "bio/cell-membrane.svg", "bio/chloroplast.svg", "bio/circulatory-system.svg", "bio/digestive-system.svg", "bio/ear.svg", "bio/endocrine-system.svg", "bio/endomembrane-system.svg", "bio/eye.svg", "bio/female-reproductive-system.svg", "bio/heart.svg", "bio/kidney-section.svg", "bio/liver.svg", "bio/lymphatic-system.svg", "bio/male-reproductive-system.svg", "bio/manifest.json", "bio/mitochondrion.svg", "bio/muscular-system.png", "bio/nephron.svg", "bio/nervous-system.svg", "bio/nucleus.svg", "bio/plant-cell.svg", "bio/respiratory-system.svg", "bio/ribosome-translation.svg", "bio/skeletal-system.svg", "bio/skin.svg", "bio/urinary-system.svg", "icon-192.png", "icon-512.png", "index.html", "maps/cont-africa.svg", "maps/cont-antarctica.svg", "maps/cont-asia.svg", "maps/cont-australia.svg", "maps/cont-europe.svg", "maps/cont-north-america.svg", "maps/cont-south-america.svg", "maps/india-outline.svg", "maps/india-political.svg", "maps/rajasthan-outline.svg", "maps/rajasthan.svg", "maps/templates.json", "maps/world-continents.svg", "maps/world-outline.svg", "vendor/jszip.min.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "manifest.webmanifest"];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('gsboard-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  // the page itself: network first, so a new version shows at once; offline falls back to the saved copy
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
    e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return; }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request))); });
