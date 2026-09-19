// sw.js - Service Worker para Notificações em Segundo Plano

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Ouve o comando enviado pelo HTML para disparar a notificação
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_ALARM') {
    const { medName, medTime } = event.data;

    self.registration.showNotification(`⏰ HORA DO REMÉDIO: ${medName}`, {
      body: `Horário: ${medTime}. Clique para abrir o app e tomar seu remédio!`,
      icon: 'https://placehold.co/192x192/005CA9/ffffff?text=UBS',
      tag: `med-alarm-${medName}`,
      requireInteraction: true, // Fica fixa na tela
      vibrate: [500, 200, 500, 200, 500],
      data: { url: './' }
    });
  }
});

// Quando o usuário clica na notificação, abre/foca o aplicativo
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
