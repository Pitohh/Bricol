const CACHE_NAME = 'bricol-v1.0.0';
const STATIC_CACHE = 'bricol-static-v1';
const DYNAMIC_CACHE = 'bricol-dynamic-v1';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch(err => console.error('[SW] Cache installation failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(err => {
            console.error('[SW] Fetch failed:', err);
            // Return offline page if available
            return caches.match('/offline.html');
          });
      })
  );
});

// Background sync (if supported)
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Push notifications (if needed)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Bricol';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Helper function for syncing tasks
async function syncTasks() {
  try {
    const pendingChanges = await getFromIndexedDB('pending_changes');
    if (pendingChanges && pendingChanges.length > 0) {
      // Sync with server if backend is available
      console.log('[SW] Syncing pending changes:', pendingChanges.length);
    }
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}
