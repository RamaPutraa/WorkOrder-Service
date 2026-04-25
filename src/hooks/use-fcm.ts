import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import {
	requestNotificationPermission,
	subscribeForegroundMessage,
} from "@/lib/fcm";
import { registerFcmTokenApi } from "@/features/notifications/services/notification-service";
import { showFcmToast } from "@/lib/show-fcm-toast";
import type { FcmNotificationType } from "@/components/ui/fcm-toast";

export const useFcm = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const {
		fcmToken,
		setFcmToken,
		setPermission,
		setHasNewNotification,
		isNotificationEnabled,
	} = useNotificationStore();

	useEffect(() => {
		if (!isAuthenticated || !isNotificationEnabled) return;

		let isIgnore = false;
		let unsubscribe: (() => void) | undefined;
		let bc: BroadcastChannel | undefined;

		const setup = async () => {
			if (isIgnore) return;
			try {
				// 1. Ask permission & get token
				const token = await requestNotificationPermission();
				setPermission(Notification.permission);

				// 2. Send token to backend
				if (token && token !== fcmToken) {
					if (isIgnore) return;
					setFcmToken(token);
					await registerFcmTokenApi(token).catch(console.error);
				}

				if (isIgnore) return;
				unsubscribe = await subscribeForegroundMessage(
					({ title, body, data }) => {
						const validTypes: FcmNotificationType[] = [
							"success",
							"warning",
							"error",
							"info",
						];
						const type: FcmNotificationType =
							validTypes.includes(data?.type as FcmNotificationType) ?
								(data?.type as FcmNotificationType)
							:	"info";

						setHasNewNotification(true);
						// FIXME: ini payload masi aneh ram
						// TODO: kalo get notif history nanti buatin logic auto redirect ke halamannya
						// TODO: masih yang diatas (redirect pas get all notif dan pas muncul toast)
						showFcmToast({
							title: title ?? "Notifikasi Baru",
							body,
							url: data?.url,
							type,
						});
					},
				);

				// 4. Background Sync: Listen for messages from Service Worker
				// This ensures red dot triggers even if message arrived while tab was in background
				bc = new BroadcastChannel("fcm-notifications");
				bc.onmessage = (event) => {
					if (isIgnore) return;
					if (event.data?.type === "NEW_NOTIFICATION") {
						setHasNewNotification(true);
					}
				};
			} catch (error) {
				console.error("[FCM] Setup failed:", error);
			}
		};

		void setup();

		return () => {
			isIgnore = true;
			if (unsubscribe) unsubscribe();
			if (bc) bc.close();
		};
	}, [
		isAuthenticated,
		isNotificationEnabled,
		fcmToken,
		setFcmToken,
		setPermission,
		setHasNewNotification,
	]);
};
