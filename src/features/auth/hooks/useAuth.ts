import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginRequest, LoginResponse } from "@/types/";
import { loginApi } from "../services/authService";
import axios from "axios";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

const useAuth = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (data: LoginRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: LoginResponse = await loginApi(data);

			if (!ress.data?.token) {
				notifyError("Gagal login", "Token tidak ditemukan");
				setError("Token tidak ditemukan");
				return;
			}
			// simpan token
			localStorage.setItem("token", ress.data?.token); // Simpan token ke localStorage atau context
			notifySuccess("Login berhasil", `Selamat datang ${ress.data.user.name}`);
			console.log("Login berhasil:", ress.data.user);
			if (ress.data.user.role === "owner_company") {
				navigate("/dashboard/owner"); // Arahkan ke halaman dashboard
			} else if (ress.data.user.role === "staff_company") {
				navigate("/dashboard/staff"); // Arahkan ke halaman dashboard
			} else if (ress.data.user.role === "staff_unassigned") {
				navigate("/dashboard/unassigned"); // Arahkan ke halaman dashboard
			} else {
				navigate("/dashboard/client"); // Arahkan ke halaman dashboard
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				notifyError(
					"Gagal login",
					error.response?.data.message || "Terjadi kesalahan saat login"
				);
				setError(
					error.response?.data.message || "Terjadi kesalahan saat login"
				);
			} else {
				setError("Terjadi kesalahan saat login");
			}
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
};

export default useAuth;
