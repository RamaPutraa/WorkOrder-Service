import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
	LoginRequest,
	LoginResponse,
	RegisterCompanyRequest,
	RegisterCompanyResponse,
	RegisterRequest,
	RegisterResponse,
} from "@/types/";
import {
	loginApi,
	clientRegisterApi,
	registerCompanyApi,
} from "../services/authService";
import axios from "axios";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useAuthStore } from "@/store/authStore";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

const useAuth = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setAuth, logout, loadFromStorage, user, token, isAuthenticated } =
		useAuthStore();

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	// fungsi login
	const login = async (data: LoginRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: LoginResponse = await loginApi(data);
			const token = ress.data?.token;
			const user = ress.data?.user;

			if (!token || !user) {
				notifyError("Gagal login", "Token tidak ditemukan");
				setError("Token tidak ditemukan");
				return;
			}
			setAuth(token, user);
			notifySuccess("Login berhasil", `Selamat datang ${user.name}`);
			console.log("Login berhasil:", user);
			navigate(redirectToRoleDashboard(user.role));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// fungsi client register
	const clientRegister = async (data: RegisterRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: RegisterResponse = await clientRegisterApi(data);
			const token = ress.data?.token;
			const user = ress.data?.user;

			if (!token || !user) {
				notifyError("Gagal registrasi", "Token atau data user tidak ditemukan");
				return;
			}

			setAuth(token, user);
			notifySuccess("Registrasi berhasil", `Selamat datang ${user.name}`);
			navigate(redirectToRoleDashboard(user.role));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const registerCompany = async (data: RegisterCompanyRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: RegisterCompanyResponse = await registerCompanyApi(data);
			const token = ress.data?.token;
			const user = ress.data?.user;

			if (!token || !user) {
				notifyError("Gagal registrasi", "Token atau data user tidak ditemukan");
				return;
			}
			console.log(user);
			setAuth(token, user);
			notifySuccess("Registrasi berhasil", `Selamat datang ${user.name}`);
			navigate(redirectToRoleDashboard(user.role));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		clientRegister,
		registerCompany,
		login,
		logout,
		user,
		token,
		isAuthenticated,
		loading,
		error,
	};
};

export default useAuth;
