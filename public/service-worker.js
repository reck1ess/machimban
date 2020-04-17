const installServiceWorker = (event) => {
  const offlinePage = new Request("/");
  event.waitUntil(
    fetch(offlinePage).then((response) => {
      return caches.open("machimban").then((cache) => {
        return cache.put(offlinePage, response);
      });
    })
  );

  console.log("[Service Worker] Successfully installed.");
};

const cachingPage = (event) => {
  event.respondWith(
    fetch(event.request).catch((error) => {
      return caches.open("machimban").then((cache) => cache.match("/"));
    })
  );

  console.log("[Service Worker] Caching Page for Offline Support");
};

const receivePushNotification = (event) => {
  console.log("[Service Worker] Push Received.");

  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: "https://spyna.it/icons/favicon.ico",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://via.placeholder.com/128/ff0000",
      },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
};

const openPushNotification = (event) => {
  console.log(
    "[Service Worker] Notification click Received.",
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
};

self.addEventListener("install", installServiceWorker);
self.addEventListener("fetch", cachingPage);
self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
