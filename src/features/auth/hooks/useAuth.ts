import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
	loginApi,
	clientRegisterApi,
	registerCompanyApi,
	staffRegisterApi,
	getProfileApi,
} from "../services/authService";
import axios from "axios";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";
import { handleApi } from "@/lib/handle-api";

const useAuth = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setAuth, logout, user, token, isAuthenticated } = useAuthStore();
	const { setProfile } = useProfileStore();

	// 🔹 fungsi login
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
			// FIXME: loading company name muncul
			await getProfile();

			notifySuccess("Login berhasil", `Selamat datang ${user.name}`);
			navigate(redirectToRoleDashboard(user.role));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal login",
					error.response?.data.message || "Terjadi kesalahan",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// 🔹 fungsi client register
	const clientRegister = async (data: RegisterRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: RegisterResponse = await clientRegisterApi(data);

			// Validasi response dari API
			if (!ress.data) {
				notifyError("Gagal registrasi", "Tidak ada data dari server");
				return;
			}

			// Tidak perlu menyimpan token, langsung redirect ke login
			notifySuccess(
				"Registrasi berhasil",
				"Silakan login menggunakan akun yang telah didaftarkan",
			);
			navigate("/login");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// 🔹 fungsi register perusahaan
	const registerCompany = async (data: RegisterCompanyRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: RegisterCompanyResponse = await registerCompanyApi(data);

			if (!ress.data) {
				notifyError("Gagal registrasi", "Tidak ada data dari server");
				return;
			}

			notifySuccess(
				"Registrasi berhasil",
				"Silakan login menggunakan akun yang telah didaftarkan",
			);
			navigate("/login");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// 🔹 fungsi staff register
	const staffRegister = async (data: RegisterStaffRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: RegisterStaffResponse = await staffRegisterApi(data);

			if (!ress.data) {
				notifyError("Gagal registrasi", "Tidak ada data dari server");
				return;
			}

			notifySuccess(
				"Registrasi berhasil",
				"Silakan login menggunakan akun yang telah didaftarkan",
			);
			navigate("/login");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal registrasi",
					error.response?.data.message || "Terjadi kesalahan",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	// 🔹 fungsi get profile
	const getProfile = useCallback(async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getProfileApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat profil", error.message);
			return null;
		}
		if (res?.data) {
			setProfile(res.data);
		}
		return res?.data;
	}, []);

	return {
		clientRegister,
		registerCompany,
		staffRegister,
		login,
		logout,
		getProfile,
		user,
		token,
		isAuthenticated,
		loading,
		error,
	};
};

export default useAuth;
