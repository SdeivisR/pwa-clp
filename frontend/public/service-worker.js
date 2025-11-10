if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registrado con éxito:', reg))
      .catch(err => console.error('Error al registrar el Service Worker:', err));
  });
} 