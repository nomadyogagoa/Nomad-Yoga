const CACHE_PREFIX = "nomad-yoga";
const STATIC_CACHE = `${CACHE_PREFIX}-static-v1`;
const PUBLIC_ASSET_CACHE = `${CACHE_PREFIX}-public-assets-v1`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-v1`;
const OFFLINE_CACHE = `${CACHE_PREFIX}-offline-v1`;
const OFFLINE_URL = "/offline";
const OFFLINE_ASSETS = [OFFLINE_URL, "/icons/icon-192x192.png"];
const CURRENT_CACHES = new Set([STATIC_CACHE, PUBLIC_ASSET_CACHE, IMAGE_CACHE, OFFLINE_CACHE]);

const PRIVATE_PATH =
  /^\/(?:api|admin|dashboard|login|register|account|member|payments?|checkout)(?:\/|$)/i;
const PUBLIC_ASSET_PATH =
  /^\/(?:assets|fonts|icons|images)\/.+\.(?:css|js|mjs|woff2?|ttf|otf|png|jpe?g|webp|avif|gif|svg|ico)$/i;

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then((cache) => cache.addAll(OFFLINE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(`${CACHE_PREFIX}-`) && !CURRENT_CACHES.has(name))
            .map((name) => caches.delete(name))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkWithOfflineFallback(request));
    return;
  }

  // Mutations, private routes, API/data responses, and authenticated requests stay network-only.
  if (
    request.headers.has("authorization") ||
    PRIVATE_PATH.test(url.pathname) ||
    url.pathname.startsWith("/_next/data/") ||
    url.pathname === "/sw.js"
  ) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 100));
    return;
  }

  if (isApprovedOptimizedImage(url)) {
    event.respondWith(staleWhileRevalidate(event, request, IMAGE_CACHE, 60));
    return;
  }

  if (PUBLIC_ASSET_PATH.test(url.pathname) && !url.pathname.startsWith("/_next/")) {
    event.respondWith(staleWhileRevalidate(event, request, PUBLIC_ASSET_CACHE, 60));
  }
});

async function networkWithOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch {
    // Navigation responses are never cached; private routes can only receive this public fallback.
    const fallback = await caches.match(OFFLINE_URL, { cacheName: OFFLINE_CACHE });
    return fallback ?? Response.error();
  }
}

function isApprovedOptimizedImage(url) {
  if (url.pathname !== "/_next/image") return false;

  const source = url.searchParams.get("url");
  if (!source) return false;

  try {
    return new URL(source, self.location.origin).hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheable(response)) await store(cache, request, response.clone(), maxEntries);
  return response;
}

async function staleWhileRevalidate(event, request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkResponse = fetch(request).then(async (response) => {
    if (isCacheable(response)) await store(cache, request, response.clone(), maxEntries);
    return response;
  });

  if (cached) {
    event.waitUntil(networkResponse.catch(() => undefined));
    return cached;
  }

  return networkResponse;
}

function isCacheable(response) {
  const cacheControl = response.headers.get("cache-control") ?? "";
  const vary = response.headers.get("vary") ?? "";

  return (
    response.ok &&
    !response.redirected &&
    response.type === "basic" &&
    !/(?:^|,)\s*(?:private|no-store)(?:\s|,|$)/i.test(cacheControl) &&
    vary.trim() !== "*"
  );
}

async function store(cache, request, response, maxEntries) {
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}
