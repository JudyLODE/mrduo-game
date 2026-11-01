// 離線快取：第一次開啟後，沒有網路也能玩。更新遊戲時把版本號 +1。
const CACHE='mrduo-v12';
const FILES=["./", "index.html", "style.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "js/assets.js", "js/case1.js", "js/case2.js", "js/cases.js", "js/engine.js", "js/main.js", "js/minigames.js", "js/minigames2.js", "js/scenes.js", "js/scenes2.js", "assets/duo/angry.webp", "assets/duo/bust_coat.webp", "assets/duo/bust_sweater.webp", "assets/duo/cheeky.webp", "assets/duo/cheer.webp", "assets/duo/coat_front.webp", "assets/duo/coat_pocket.webp", "assets/duo/coat_puzzled.webp", "assets/duo/coat_shy.webp", "assets/duo/coat_side.webp", "assets/duo/coat_stand.webp", "assets/duo/coat_tip.webp", "assets/duo/confident.webp", "assets/duo/confused.webp", "assets/duo/face.webp", "assets/duo/gasp.webp", "assets/duo/greet.webp", "assets/duo/hmm.webp", "assets/duo/jump.webp", "assets/duo/laugh.webp", "assets/duo/oops.webp", "assets/duo/point.webp", "assets/duo/run.webp", "assets/duo/shock.webp", "assets/duo/teary.webp", "assets/duo/think.webp", "assets/duo/victory.webp", "assets/duo/walk.webp", "assets/duo/welcome.webp", "assets/duo/worry.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
