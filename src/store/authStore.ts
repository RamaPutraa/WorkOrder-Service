import { create } from "zustand";
import { logoutApi } from "@/features/auth/services/authService";

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
			// Call logout API endpoint
			await logoutApi();
		} catch (error) {
			// Even if API call fails, still clear local storage
			console.error("Logout API error:", error);
		} finally {
			// Always clear local storage and state
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			set({ token: null, user: null, isAuthenticated: false });
		}
	},
}));
