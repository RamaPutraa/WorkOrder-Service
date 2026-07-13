import { useRef, useState } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { LoaderCircle, ShieldCheck, RotateCcw } from "lucide-react";
import useOtp from "../../hooks/useOtp";

interface OtpFormProps {
	email: string;
}

const OTP_LENGTH = 6;

const OtpForm = ({ email }: OtpFormProps) => {
	const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { verifyOtp, resendOtp, loading, resendLoading, error, countdown, canResend } =
		useOtp(email);

	const focusInput = (index: number) => {
		inputRefs.current[index]?.focus();
	};

	const handleChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return; // only digits

		const newDigits = [...digits];
		newDigits[index] = value.slice(-1); // ambil digit terakhir
		setDigits(newDigits);

		// Auto-focus ke input berikutnya
		if (value && index < OTP_LENGTH - 1) {
			focusInput(index + 1);
		}
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			if (digits[index]) {
				const newDigits = [...digits];
				newDigits[index] = "";
				setDigits(newDigits);
			} else if (index > 0) {
				focusInput(index - 1);
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			focusInput(index - 1);
		} else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
			focusInput(index + 1);
		}
	};

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
		if (!pasted) return;

		const newDigits = [...digits];
		pasted.split("").forEach((char, i) => {
			newDigits[i] = char;
		});
		setDigits(newDigits);
		focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const otp = digits.join("");
		if (otp.length < OTP_LENGTH) return;
		verifyOtp(otp);
	};

	const isComplete = digits.every((d) => d !== "");
	const maskedEmail = email
		? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
		: "";

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Info email */}
			<div className="text-center">
				<p className="text-sm text-gray-500">
					Kode OTP telah dikirim ke{" "}
					<span className="font-semibold text-blue-600">{maskedEmail}</span>
				</p>
			</div>

			{/* OTP Boxes */}
			<div className="flex justify-center gap-3">
				{digits.map((digit, index) => (
					<input
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						id={`otp-input-${index}`}
						type="text"
						inputMode="numeric"
						maxLength={1}
						value={digit}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={handlePaste}
						onFocus={(e) => e.target.select()}
						className={[
							"w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200",
							"focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
							digit
								? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
								: "border-gray-200 bg-white text-gray-900",
							error ? "border-red-300 bg-red-50" : "",
						]
							.filter(Boolean)
							.join(" ")}
					/>
				))}
			</div>

			{/* Error message */}
			{error && (
				<p className="text-center text-sm text-red-500 flex items-center justify-center gap-1.5">
					<span className="inline-flex w-4 h-4 rounded-full bg-red-100 text-red-500 text-xs items-center justify-center font-bold shrink-0">
						!
					</span>
					{error}
				</p>
			)}

			{/* Submit button */}
			<button
				type="submit"
				disabled={loading || !isComplete}
				id="verify-otp-btn"
				className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
			>
				{loading ? (
					<LoaderCircle className="h-4 w-4 animate-spin" />
				) : (
					<ShieldCheck size={16} />
				)}
				{loading ? "Memverifikasi..." : "Verifikasi OTP"}
			</button>

			{/* Resend OTP */}
			<div className="text-center">
				{countdown > 0 ? (
					<p className="text-sm text-gray-400">
						Kirim ulang OTP dalam{" "}
						<span className="font-semibold text-blue-500">{countdown}s</span>
					</p>
				) : (
					<button
						type="button"
						id="resend-otp-btn"
						onClick={resendOtp}
						disabled={resendLoading || !canResend}
						className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<RotateCcw
							size={13}
							className={resendLoading ? "animate-spin" : ""}
						/>
						{resendLoading ? "Mengirim..." : "Kirim ulang OTP"}
					</button>
				)}
			</div>
		</form>
	);
};

export default OtpForm;
