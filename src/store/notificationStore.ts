import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NotificationState = {
  fcmToken: string | null;
  permission: NotificationPermission | 'idle';
  isNotificationEnabled: boolean;
  setFcmToken: (token: string | null) => void;
  setPermission: (p: NotificationPermission) => void;
  setIsNotificationEnabled: (val: boolean) => void;
  hasNewNotification: boolean;
  setHasNewNotification: (val: boolean) => void;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      fcmToken: null,
      permission: 'idle',
      isNotificationEnabled: true, // Default to true so it works normally if granted
      hasNewNotification: false,
      setFcmToken: (token) => set({ fcmToken: token }),
      setPermission: (permission) => set({ permission }),
      setIsNotificationEnabled: (val) => set({ isNotificationEnabled: val }),
      setHasNewNotification: (val) => set({ hasNewNotification: val }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
