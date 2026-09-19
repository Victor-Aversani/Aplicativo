// Nome do Cache
const CACHE_NAME = 'hiperdia-ubs-v1';

// Arquivos para salvar em cache para funcionamento offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto com sucesso');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições para permitir funcionamento offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Escuta eventos de Notificação Push (disparados via servidor/WebPush)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'Lembrete de saúde Hiperdia UBS';

  const options = {
    body: data,
    icon: 'https://placehold.co/192x192/005CA9/ffffff.png?text=UBS',
    badge: 'https://placehold.co/192x192/005CA9/ffffff.png?text=UBS',
    vibrate: [200, 100, 200],
    tag: 'lembrete-saude',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification('Hiperdia UBS', options)
  );
});

// Ação ao clicar na notificação (abre o aplicativo)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./');
    })
  );
});
