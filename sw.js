// Spezezy service worker. To release an update: change V (spezezy-v10 -> spezezy-v11).
// Even if you forget, the app notices a changed index.html or srv.js and shows an "Update ready" banner.
const V='spezezy-v10',FONTS='spezezy-fonts',CORE=['./','index.html','srv.js','manifest.webmanifest','icon-192.png','icon-512.png'];
const tell=()=>self.clients.matchAll({type:'window'}).then(cs=>cs.forEach(c=>c.postMessage({type:'spz-update'})));
const watch=u=>/\/$/.test(u.pathname)||/\.html$/.test(u.pathname)||/srv\.js$/.test(u.pathname)||!/\.[a-z0-9]+$/i.test(u.pathname);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function refresh(r,h,w){return fetch(r).then(n=>{if(!n||!n.ok)return n;const a=n.clone(),b=n.clone();return caches.open(V).then(async c=>{if(w&&h){const[x,y]=await Promise.all([h.clone().text(),a.text()]);if(x!==y){await c.put(r,b);await tell()}}else await c.put(r,b);return n})}).catch(()=>null)}
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith((async()=>{const h=await caches.match(r,{ignoreSearch:true}),p=refresh(r,h,watch(u));e.waitUntil(p);return h||(await p)||(await caches.match('index.html'))})());return}
 if(/(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.open(FONTS).then(c=>c.match(r).then(h=>{const f=fetch(r).then(n=>{c.put(r,n.clone());return n}).catch(()=>h);return h||f})))}
});
