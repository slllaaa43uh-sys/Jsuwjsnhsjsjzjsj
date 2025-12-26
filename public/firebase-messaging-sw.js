
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js' );
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js' );

firebase.initializeApp({
  apiKey: "AIzaSyD08yfFqO32HBSU9SLxFx2UuPvkVdEhMWY",
  authDomain: "mihnty-e94ca.firebaseapp.com",
  projectId: "mihnty-e94ca",
  storageBucket: "mihnty-e94ca.firebasestorage.app",
  messagingSenderId: "123005243140",
  appId: "1:123005243140:web:7ba255ae7bcb25ccd58a51"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📬 إشعار في الخلفية:', payload);
  const notificationTitle = payload.notification.title || 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});