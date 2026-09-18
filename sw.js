self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Você tem um lembrete no aplicativo!',
    icon: 'https://placehold.co/192x192/005CA9/ffffff?text=UBS',
    badge: 'https://placehold.co/192x192/005CA9/ffffff?text=UBS'
  };

  event.waitUntil(
    self.registration.showNotification('AMA/UBS Jardim Três Marias', options)
  );
});
