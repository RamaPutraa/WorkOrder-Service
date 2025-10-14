import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	let token = useAuthStore.getState().token;
	if (!token) {
		token = localStorage.getItem("token");
	}
	if (token) {
		console.log(token);
		config.headers["Authorization"] = token;
	}
	return config;
});

export default api;
