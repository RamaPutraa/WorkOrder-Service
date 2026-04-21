import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  fcmToken: string | null;
  permission: NotificationPermission | 'idle';
  setFcmToken: (token: string | null) => void;
  setPermission: (p: NotificationPermission) => void;
  hasNewNotification: boolean;
  setHasNewNotification: (val: boolean) => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      fcmToken: null,
      permission: 'idle',
      hasNewNotification: false,
      setFcmToken: (token) => set({ fcmToken: token }),
      setPermission: (permission) => set({ permission }),
      setHasNewNotification: (val) => set({ hasNewNotification: val }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
