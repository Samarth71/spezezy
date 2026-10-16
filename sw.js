// Spezezy service worker. To release an update: change V (spezezy-v6 -> spezezy-v7).
const V='spezezy-v6',FONTS='spezezy-fonts',CORE=['./','index.html','srv.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(r,c));return n}).catch(()=>caches.match('index.html'))));return}
 if(/(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(h=>{const f=fetch(r).then(n=>{c.put(r,n.clone());return n}).catch(()=>h);return h||f})))}
});
