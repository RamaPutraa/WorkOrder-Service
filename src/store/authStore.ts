import { create } from "zustand";
import type { User } from "@/types";

type AuthState = {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	setAuth: (token: string, user: User) => void;
	logout: () => void;
	loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	token: null,
	user: null,
	isAuthenticated: false,

	setAuth: (token, user) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));

		set({
			token,
			user,
			isAuthenticated: true,
		});
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({
			token: null,
			user: null,
			isAuthenticated: false,
		});
	},

	loadFromStorage: () => {
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");

		if (token && userData) {
			set({
				token,
				user: JSON.parse(userData),
				isAuthenticated: true,
			});
		}
	},
}));
