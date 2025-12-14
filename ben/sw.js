/**
 * Service Worker for Business Card Scanner PWA
 *
 * Provides offline functionality by caching critical assets and implementing
 * intelligent caching strategies for different resource types.
 */

const CACHE_VERSION = 'v1'
const CACHE_NAME = `business-card-scanner-${CACHE_VERSION}`

// Critical assets to cache during install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/business-card-scanner',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Tesseract.js assets (these will be cached on first use)
const TESSERACT_ASSETS_PATTERN = /tesseract|traineddata/i

// Asset type patterns for caching strategies
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/i, // Images
  /\.(?:woff|woff2|ttf|eot)$/i,         // Fonts
  /\.(?:css|js)$/i,                     // Stylesheets and scripts
  /manifest\.json$/i,                   // Manifest
]

const NETWORK_FIRST_PATTERNS = [
  /\/api\//i,                           // API calls
]

/**
 * Install Event
 *
 * Triggered when the service worker is first installed.
 * Pre-caches critical assets for offline functionality.
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_NAME)

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching critical assets')
        // Use addAll to cache all static assets
        // Note: This will fail if any resource fails to cache
        return cache.addAll(STATIC_ASSETS.filter(url => {
          // Skip icon URLs if they don't exist yet (during development)
          if (url.includes('/icons/')) {
            return false // Icons may not be generated yet
          }
          return true
        }))
      })
      .then(() => {
        console.log('[Service Worker] Critical assets cached successfully')
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache assets:', error)
      })
  )
})

/**
 * Activate Event
 *
 * Triggered when the service worker becomes active.
 * Cleans up old caches from previous versions.
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_NAME)

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Delete all caches that don't match the current version
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('business-card-scanner-') && cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('[Service Worker] Old caches cleaned up')
        // Claim all clients immediately
        return self.clients.claim()
      })
  )
})

/**
 * Fetch Event
 *
 * Intercepts all fetch requests and applies caching strategies:
 * - Cache-first: Static assets (images, fonts, CSS, JS)
 * - Network-first: API calls and dynamic content
 * - Stale-while-revalidate: HTML pages
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests (except for Tesseract.js assets)
  if (url.origin !== location.origin && !TESSERACT_ASSETS_PATTERN.test(url.href)) {
    return
  }

  // Determine caching strategy based on URL pattern
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirst(request))
  } else if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    // Network-first strategy for API calls
    event.respondWith(networkFirst(request))
  } else if (TESSERACT_ASSETS_PATTERN.test(url.href)) {
    // Cache-first for Tesseract.js assets (they're large and don't change)
    event.respondWith(cacheFirst(request))
  } else {
    // Stale-while-revalidate for HTML and other resources
    event.respondWith(staleWhileRevalidate(request))
  }
})

/**
 * Cache-First Strategy
 *
 * Tries to serve from cache first, falls back to network if not found.
 * Good for: Static assets that don't change frequently
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    console.log('[Service Worker] Cache hit:', request.url)
    return cachedResponse
  }

  console.log('[Service Worker] Cache miss, fetching:', request.url)
  try {
    const networkResponse = await fetch(request)

    // Only cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      // Clone the response before caching (response can only be consumed once)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', request.url, error)
    // Return a fallback response or error page
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    })
  }
}

/**
 * Network-First Strategy
 *
 * Tries network first, falls back to cache if offline.
 * Good for: API calls and dynamic content
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    return new Response('Offline - No cached data available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    })
  }
}

/**
 * Stale-While-Revalidate Strategy
 *
 * Returns cached response immediately while fetching fresh data in background.
 * Good for: HTML pages and resources that should be reasonably fresh
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  // Fetch in background and update cache
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch((error) => {
      console.error('[Service Worker] Background fetch failed:', request.url, error)
    })

  // Return cached response immediately, or wait for network if no cache
  return cachedResponse || fetchPromise
}

/**
 * Message Event Handler
 *
 * Allows communication between the service worker and clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  // Handle cache clear request
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[Service Worker] Cache cleared')
        event.ports[0].postMessage({ success: true })
      })
    )
  }

  // Handle cache status request
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.keys()
      }).then((keys) => {
        event.ports[0].postMessage({
          cacheVersion: CACHE_VERSION,
          cachedUrls: keys.map(request => request.url)
        })
      })
    )
  }
})

console.log('[Service Worker] Loaded successfully')
