import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
		config.headers["Authorization"] = token;
	}
	return config;
});

export default api;
