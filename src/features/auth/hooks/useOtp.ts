import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../services/authService";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";

const RESEND_COOLDOWN = 60; // detik

const useOtp = (email: string) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

	// 🔹 Countdown timer untuk resend OTP
	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [countdown]);

	// 🔹 Verify OTP
	const verifyOtp = async (otp: string) => {
		if (!email) {
			notifyError("Gagal verifikasi", "Email tidak ditemukan, silakan daftar ulang");
			navigate("/register");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error: err } = await handleApi(() =>
			verifyOtpApi({ email, otp }),
		);

		setLoading(false);

		if (err) {
			setError(err.message);
			notifyError("Verifikasi gagal", err.message);
			return;
		}

		notifySuccess(
			"Verifikasi berhasil",
			res?.data?.message || "Akun Anda telah diverifikasi",
		);
		navigate("/login");
	};

	// 🔹 Resend OTP
	const resendOtp = useCallback(async () => {
		if (!email) {
			notifyError("Gagal kirim ulang", "Email tidak ditemukan");
			return;
		}
		if (countdown > 0) return;

		setResendLoading(true);
		setError(null);

		const { data: res, error: err } = await handleApi(() =>
			resendOtpApi({ email }),
		);

		setResendLoading(false);

		if (err) {
			setError(err.message);
			notifyError("Gagal kirim ulang OTP", err.message);
			return;
		}

		notifySuccess(
			"OTP terkirim",
			res?.data?.message || "Kode OTP baru telah dikirim ke email Anda",
		);
		setCountdown(RESEND_COOLDOWN);
	}, [email, countdown]);

	return {
		verifyOtp,
		resendOtp,
		loading,
		resendLoading,
		error,
		countdown,
		canResend: countdown <= 0,
	};
};

export default useOtp;
