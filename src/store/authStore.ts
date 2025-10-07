import { create } from "zustand";

type AuthState = {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setAuth: (token: string, user: User) => void;
	logout: () => void;
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

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({ token: null, user: null, isAuthenticated: false });
	},
}));
