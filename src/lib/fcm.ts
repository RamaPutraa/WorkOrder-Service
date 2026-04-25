import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging, firebaseConfig } from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Meminta izin notifikasi dari browser dan mendapatkan FCM token.
 * CATATAN: Fungsi ini harus dipanggil dalam konteks user gesture (klik)
 * agar browser menampilkan dialog izin.
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  // Minta izin PERTAMA, sebelum proses async lain,
  // agar browser mendeteksi ini dipicu dari interaksi user (klik).
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const swUrl = `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&authDomain=${firebaseConfig.authDomain}&projectId=${firebaseConfig.projectId}&storageBucket=${firebaseConfig.storageBucket}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`;
    await navigator.serviceWorker.register(swUrl);

    // Tunggu hingga Service Worker benar-benar aktif sebelum getToken
    const activeRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: activeRegistration,
    });
    return token;
  } catch (err) {
    console.error('[FCM] getToken gagal:', err);
    return null;
  }
};

/**
 * Subscribe ke pesan FCM saat aplikasi aktif di foreground.
 * Mengembalikan fungsi unsubscribe.
 */
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
