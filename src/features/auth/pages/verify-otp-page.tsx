import { useEffect, useState } from "react";
import { ChevronLeft, ShieldAlert, Mail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OtpForm from "../components/form-schema/otp-form";

const VerifyOtpPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const emailParam = searchParams.get("email") ?? "";
	const [email] = useState<string>(emailParam);

	// Jika tidak ada email, redirect ke register
	useEffect(() => {
		if (!emailParam) {
			navigate("/register");
		}
	}, [emailParam, navigate]);

	const maskedEmail = email
		? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
		: "";

	if (!email) return null;

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg px-4 py-10">
				{/* Back button */}
				<button
					onClick={() => navigate(-1)}
					className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
				>
					<ChevronLeft
						size={16}
						className="group-hover:-translate-x-0.5 transition-transform"
					/>
					Kembali
				</button>

				{/* Heading */}
				<div className="mb-8">
					{/* Icon */}
					<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 mb-5">
						<ShieldAlert className="text-blue-600" size={26} />
					</div>

					<h2 className="text-2xl font-extrabold text-gray-900 mb-1">
						Verifikasi OTP
					</h2>
					<p className="text-sm text-gray-500">
						Masukkan kode 6 digit yang telah dikirimkan ke email Anda.
					</p>
				</div>

				{/* Card */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
					{/* Card Header */}
					<div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 shrink-0">
							<Mail className="text-blue-600" size={15} />
						</div>
						<div>
							<h3 className="text-base font-semibold text-gray-900">
								Kode Verifikasi
							</h3>
							<p className="text-xs text-gray-500 mt-0.5">
								Dikirim ke{" "}
								<span className="font-medium text-indigo-600">
									{maskedEmail}
								</span>
							</p>
						</div>
					</div>

					<OtpForm email={email} />
				</div>

			
			</div>
		</div>
	);
};

export default VerifyOtpPage;
