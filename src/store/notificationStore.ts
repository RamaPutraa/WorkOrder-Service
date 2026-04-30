import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNotificationsApi } from "@/features/notifications/services/notification-service";

type NotificationState = {
	fcmToken: string | null;
	hasNewNotification: boolean;
	notifications: AppNotification[];
	isLoading: boolean;
	error: string | null;
	setFcmToken: (token: string | null) => void;
	setHasNewNotification: (val: boolean) => void;
	fetchNotifications: (isSilent?: boolean) => Promise<void>;
	markAsReadLocal: (notificationId: string) => void;
};

export const useNotificationStore = create<NotificationState>()(
	persist(
		(set, get) => ({
			fcmToken: null,
			hasNewNotification: false,
			notifications: [],
			isLoading: false,
			error: null,

			setFcmToken: (token) => set({ fcmToken: token }),
			setHasNewNotification: (val) => {
				set({ hasNewNotification: val });
				if (val) {
					// Jika ada notif baru masuk, otomatis fetch ulang secara silent
					get().fetchNotifications(true);
				}
			},

			fetchNotifications: async (isSilent = false) => {
				if (!isSilent) set({ isLoading: true });
				set({ error: null });
				try {
					const res = await getNotificationsApi();
					const data = res.data?.data ?? [];
					set({
						notifications: data,
						hasNewNotification: false, // Reset red dot when we get fresh data
					});
				} catch {
					if (!isSilent) set({ error: "Gagal memuat notifikasi." });
				} finally {
					if (!isSilent) set({ isLoading: false });
				}
			},

			markAsReadLocal: (id) => {
				set((state) => ({
					notifications: state.notifications.map((n) =>
						n._id === id ? { ...n, isRead: true } : n,
					),
				}));
			},
		}),
		{
			name: "notification-storage",
			// Hanya persist fcmToken agar tetap awet di storage
			partialize: (state) => ({ fcmToken: state.fcmToken }),
		},
	),
);

