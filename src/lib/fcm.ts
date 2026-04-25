import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { getFirebaseMessaging, firebaseConfig } from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async (): Promise<string | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return null;
  }

  try {
    const swUrl = `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&authDomain=${firebaseConfig.authDomain}&projectId=${firebaseConfig.projectId}&storageBucket=${firebaseConfig.storageBucket}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`;
    const registration = await navigator.serviceWorker.register(swUrl);
    
    const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration 
    });
    return token;
  } catch (err) {
    console.error('[FCM] getToken gagal:', err);
    return null;
  }
};

export const subscribeForegroundMessage = async (
  callback: (payload: { title?: string; body?: string; data?: Record<string, string> }) => void,
) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback({
      title: payload.notification?.title || payload.data?.title,
      body: payload.notification?.body || payload.data?.body,
      data: payload.data as Record<string, string>,
    });
  });
};

export const deleteNotificationToken = async (): Promise<boolean> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return false;

    return await deleteToken(messaging);
  } catch (err) {
    console.error('[FCM] deleteToken gagal:', err);
    return false;
  }
};
