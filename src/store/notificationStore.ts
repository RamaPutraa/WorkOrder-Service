import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  fcmToken: string | null;
  hasNewNotification: boolean;
  setFcmToken: (token: string | null) => void;
  setHasNewNotification: (val: boolean) => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      fcmToken: null,
      hasNewNotification: false,
      setFcmToken: (token) => set({ fcmToken: token }),
      setHasNewNotification: (val) => set({ hasNewNotification: val }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
