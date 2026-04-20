import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { requestNotificationPermission, subscribeForegroundMessage } from '@/lib/fcm';
import { registerFcmTokenApi } from '@/features/notifications/services/notification-service';
import { showFcmToast } from '@/lib/show-fcm-toast';
import type { FcmNotificationType } from '@/components/ui/fcm-toast';

export const useFcm = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { fcmToken, setFcmToken, setPermission } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      try {
        // 1. Ask permission & get token
        const token = await requestNotificationPermission();
        setPermission(Notification.permission);

        // 2. Send token to backend
        if (token && token !== fcmToken) {
          setFcmToken(token);
          await registerFcmTokenApi(token).catch(console.error);
        }

        // 3. Listen to foreground messages
        unsubscribe = await subscribeForegroundMessage(({ title, body, data }) => {
          const validTypes: FcmNotificationType[] = ['success', 'warning', 'error', 'info'];
          const type: FcmNotificationType =
            validTypes.includes(data?.type as FcmNotificationType)
              ? (data?.type as FcmNotificationType)
              : 'info';

          showFcmToast({
            title: title ?? 'Notifikasi Baru',
            body,
            url: data?.url,
            type,
          });
        });
      } catch (error) {
        console.error('[FCM] Setup failed:', error);
      }
    };

    void setup();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated, fcmToken, setFcmToken, setPermission]);
};
