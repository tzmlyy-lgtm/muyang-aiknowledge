// 沐阳 Service Worker：静态资源预缓存 + 同源请求 stale-while-revalidate
// 资讯内容离线可用性由页面侧 localStorage 兜底（trends-news-cache / 内置快照）保障
const CACHE = "muyang-v1";
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "script.js",
  "knowledge.js",
  "docs-data.js",
  "brief-library-data.js",
  "pdfs-data.js",
  "quizzes.js",
  "notes-data.js",
  "briefing-data.js",
  "ai-trends-data.js",
  "vendor/marked.min.js",
  "images/logo-emblem.webp",
  "images/icon-192.png",
  "images/icon-512.png",
  "images/minimalist_narrative_gouache_p_2026-08-31T14-47-06.webp",
  "images/minimalist_narrative_gouache_p_2026-08-31T14-47-07.webp",
  "images/minimalist_narrative_gouache_o_2026-08-31T15-10-42.webp",
  "images/minimalist_narrative_gouache_o_2026-08-31T15-36-30.webp",
  "images/minimalist_narrative_gouache_o_2026-08-31T15-37-00.webp",
  "images/minimalist_narrative_gouache_o_2026-08-31T15-37-49.webp"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // 第三方 API（AI HOT）不走 SW，由页面兜底
  // 同源 GET：stale-while-revalidate —— 先回缓存（秒开/离线可用），后台静默更新
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
