import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  fcmToken: string | null;
  permission: NotificationPermission | 'idle';
  setFcmToken: (token: string | null) => void;
  setPermission: (p: NotificationPermission) => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      fcmToken: null,
      permission: 'idle',
      setFcmToken: (token) => set({ fcmToken: token }),
      setPermission: (permission) => set({ permission }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
