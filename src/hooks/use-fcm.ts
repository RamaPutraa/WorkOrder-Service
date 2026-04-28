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
import useAuth from "@/features/auth/hooks/useAuth";

const VALID_TOAST_TYPES: FcmNotificationType[] = [
	"success",
	"warning",
	"error",
	"info",
];

/** Mapping resource type dari backend ke URL halaman yang sesuai */
const getResourceUrl = (
	resource?: string,
	resourceId?: string,
): string | undefined => {
	if (!resource) return undefined;
	const { user } = useAuth();
	const isClient = user?.role === "client";
	const isUnassigned = user?.role === "staff_unassigned";
	const map: Record<string, string> = {
		work_order:
			resourceId ?
				`/dashboard/internal/workorders/detail/${resourceId}`
			:	"/dashboard/internal/workorders",
		invitation:
			isUnassigned ?
				`/dashboard/unassigned/invitations-history`
			:	"/dashboard/internal/staff/history-invitations",
		service_request:
			isClient ?
				resourceId ? `/dashboard/client/submissions/${resourceId}`
				:	"/dashboard/client/submissions"
			: resourceId ?
				`/dashboard/internal/business/services/request/detail/${resourceId}`
			:	"/dashboard/internal/business/services/request",
	};
	return map[resource];
};

const setupForegroundListeners = async (
	setHasNewNotification: (val: boolean) => void,
) => {
	const unsubscribe = await subscribeForegroundMessage(
		({ title, body, data }) => {
			const type: FcmNotificationType =
				VALID_TOAST_TYPES.includes(data?.type as FcmNotificationType) ?
					(data?.type as FcmNotificationType)
				:	"info";
			setHasNewNotification(true);
			showFcmToast({
				title: title ?? "Notifikasi Baru",
				body,
				url: getResourceUrl(data?.resource, data?.resourceId),
				type,
			});
		},
	);

	const bc = new BroadcastChannel("fcm-notifications");
	bc.onmessage = (event) => {
		if (event.data?.type === "NEW_NOTIFICATION") {
			setHasNewNotification(true);
		}
	};

	return () => {
		unsubscribe?.();
		bc.close();
	};
};

export const useFcm = () => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { fcmToken, setFcmToken, setHasNewNotification } =
		useNotificationStore();

	useEffect(() => {
		if (!isAuthenticated) return;

		let isIgnore = false;
		let cleanup: (() => void) | undefined;

		const init = async () => {
			const currentPermission = Notification.permission;

			// Kasus 1: Izin sudah granted DAN token sudah ada → langsung setup listener.
			if (currentPermission === "granted" && fcmToken) {
				cleanup = await setupForegroundListeners(setHasNewNotification);
				return;
			}

			// Kasus 2: Izin sudah granted TAPI token tidak ada (misal: setelah clear storage
			// atau token expired di Firebase) → ambil token baru tanpa perlu dialog izin.
			if (currentPermission === "granted" && !fcmToken) {
				try {
					const token = await requestNotificationPermission();
					if (!token || isIgnore) return;
					setFcmToken(token);
					await registerFcmTokenApi(token).catch(console.error);
					if (isIgnore) return;
					cleanup = await setupForegroundListeners(setHasNewNotification);
				} catch (error) {
					console.error("[FCM] Failed to refresh token:", error);
				}
				return;
			}

			// Kasus 3: Izin belum ditentukan (default) → tunggu klik pertama user
			// agar browser menampilkan dialog izin (wajib ada user gesture).
			if (currentPermission === "default") {
				const handleFirstClick = async () => {
					window.removeEventListener("click", handleFirstClick);
					if (isIgnore) return;
					try {
						const token = await requestNotificationPermission();
						if (!token || isIgnore) return;
						setFcmToken(token);
						await registerFcmTokenApi(token).catch(console.error);
						if (isIgnore) return;
						cleanup = await setupForegroundListeners(setHasNewNotification);
					} catch (error) {
						console.error("[FCM] Setup failed:", error);
					}
				};
				window.addEventListener("click", handleFirstClick);
				return () => {
					window.removeEventListener("click", handleFirstClick);
				};
			}

			// Kasus 4: Izin denied → tidak ada yang perlu dilakukan.
		};

		void init();

		return () => {
			isIgnore = true;
			cleanup?.();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);
};
