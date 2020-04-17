const pushServerPublicKey = process.env.WEB_PUSH_PUBLIC_KEY;

const isPushNotificationSupported = () => {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in window.navigator && "PushManager" in window;
};

const askUserPermission = async () => {
  return await Notification.requestPermission();
};

const sendNotification = (title, text) => {
  const options = {
    body: text,
    vibrate: [200, 100, 200],
    tag: "입고 알림",
    icon: "/icons/icon-128x128.png",
    image: "/icons/icon-128x128.png",
    badge: "/icons/icon-128x128.png",
    actions: [
      {
        title,
        action: "Detail",
        icon: "https://via.placeholder.com/128/ff0000",
      },
    ],
  };
  window.navigator.serviceWorker.ready.then((serviceWorker) => {
    serviceWorker.showNotification(title, options);
  });
};

const registerServiceWorker = () => {
  return window.navigator.serviceWorker.register("/sw.js");
};

const createNotificationSubscription = async () => {
  const serviceWorker = await window.navigator.serviceWorker.ready;
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey,
  });
};

const getUserSubscription = () => {
  return window.navigator.serviceWorker.ready
    .then((serviceWorker) => {
      return serviceWorker.pushManager.getSubscription();
    })
    .then((pushSubscription) => {
      return pushSubscription;
    });
};

export {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  sendNotification,
  createNotificationSubscription,
  getUserSubscription,
};
