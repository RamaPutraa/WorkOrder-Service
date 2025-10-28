import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor: sebelum request dikirim
api.interceptors.request.use(
	(config) => {
		let token = useAuthStore.getState().token;
		if (!token) {
			token = localStorage.getItem("token");
		}

		if (token) {
			config.headers["Authorization"] = token;
		}

		const fullUrl = `${config.baseURL?.replace(/\/$/, "")}${config.url}`;
		// 🟡 Logging request
		console.groupCollapsed(
			`📤 [REQUEST] ${config.method?.toUpperCase()} → ${fullUrl}`
		);
		console.log("Endpoint:", fullUrl);
		console.log("Headers:", config.headers);
		if (config.params) console.log("Params:", config.params);
		if (config.data) console.log("Body:", config.data);
		console.groupEnd();

		return config;
	},
	(error) => {
		console.error("❌ [REQUEST ERROR]", error);
		return Promise.reject(error);
	}
);

// Interceptor: setelah response diterima
api.interceptors.response.use(
	(response) => {
		// 🟢 Logging response sukses
		console.groupCollapsed(
			`✅ [RESPONSE] ${response.config.method?.toUpperCase()} ${
				response.config.url
			}`
		);
		console.log("Status:", response.status);
		console.log("Data:", response.data);
		console.groupEnd();

		return response;
	},
	(error) => {
		// 🔴 Logging response gagal
		if (error.response) {
			console.groupCollapsed(
				`[RESPONSE ERROR] ${error.config?.method?.toUpperCase()} ${
					error.config?.url
				}`
			);
			console.log("Status:", error.response.status);
			console.log("Data:", error.response.data);
			console.groupEnd();
		} else {
			console.error("🚨 [NETWORK ERROR]", error.message);
		}
		return Promise.reject(error);
	}
);

export default api;
