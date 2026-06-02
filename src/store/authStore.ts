import { create } from "zustand";
import { logoutApi } from "@/features/auth/services/authService";
import { unregisterFcmTokenApi } from "@/features/notifications/services/notification-service";
import { useNotificationStore } from "./notificationStore";
import { useFaqChatStore } from "./faqChatStore";
import { useStaffCompanyStore, useStaffHistoryStore } from "./staffStore";
import { useFormStore } from "./formStore";
import { useMembercodeStore } from "./membercodeStore";
import { usePositionStore } from "./potisionStore";
import { usePricingStore } from "./pricingStore";
import { useProfileStore } from "./profileStore";
import { useServiceStore } from "./serviceStore";
import { useWoDetailStore } from "./wo-detail-store";
import { useDialogStore } from "./dialogStore";
import { queryClient } from "@/App";

type AuthState = {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setAuth: (token: string, user: User) => void;
	updateUser: (data: Partial<User>) => void;
	logout: () => Promise<void>;
};

// 🔹 Fungsi bantu untuk inisialisasi dari localStorage
const getInitialAuthState = (): Pick<
	AuthState,
	"token" | "user" | "isAuthenticated"
> => {
	const token = localStorage.getItem("token");
	const userData = localStorage.getItem("user");

	if (token && userData) {
		try {
			const user = JSON.parse(userData);
			return { token, user, isAuthenticated: true };
		} catch {
			localStorage.removeItem("user");
		}
	}

	return { token: null, user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
	...getInitialAuthState(),

	setAuth: (token, user) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		set({ token, user, isAuthenticated: true });
	},

	updateUser: (data) => {
		set((state) => {
			if (!state.user) return state;
			const updatedUser = { ...state.user, ...data };
			localStorage.setItem("user", JSON.stringify(updatedUser));
			return { user: updatedUser };
		});
	},

	logout: async () => {
		try {
			// Unregister FCM token first if exists
			const fcmToken = useNotificationStore.getState().fcmToken;
			if (fcmToken) {
				await unregisterFcmTokenApi(fcmToken).catch((err) =>
					console.error("Failed to unregister FCM token", err),
				);
				useNotificationStore.getState().setFcmToken(null);
			}

			// Call logout API endpoint
			await logoutApi();
		} catch (error) {
			// Even if API call fails, still clear local storage
			console.error("Logout API error:", error);
		} finally {
			// Always clear local storage and state
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("profile-storage");
			localStorage.removeItem("notification-storage");
			localStorage.removeItem("faq-chat-storage");

			// Clear semua Zustand store cache
			useFaqChatStore.getState().clearChatHistory();
			useStaffCompanyStore.getState().clearStaffCompany();
			useStaffHistoryStore.getState().clearStaffHistorys();
			useFormStore.getState().clearCache();
			useMembercodeStore.getState().clearCache();
			usePositionStore.getState().clearPositions();
			usePricingStore.getState().clearCache();
			useProfileStore.getState().clearProfile();
			useServiceStore.getState().clearCache();
			useWoDetailStore.setState({ cache: {} });
			useDialogStore.getState().closeDialog();

			// Clear React Query cache
			queryClient.clear();

			set({ token: null, user: null, isAuthenticated: false });
		}
	},
}));
