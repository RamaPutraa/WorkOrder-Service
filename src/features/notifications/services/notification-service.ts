import apiClient from "@/lib/api";

export const registerFcmTokenApi = (token: string) => {
	return apiClient.post("/notifications/fcm-token", { token });
};

export const unregisterFcmTokenApi = (token: string) => {
	return apiClient.delete("/notifications/fcm-token", { data: { token } });
};

export const getNotificationsApi = () => {
	return apiClient.get<NotificationResponse>("/notifications");
};
