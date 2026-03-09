import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientRegForm from "../components/form-schema/client-reg-form";

const ClientPageForm = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-lg">
				{/* Back + Heading */}
				<div className="mb-8">
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
						<ChevronLeft
							size={16}
							className="group-hover:-translate-x-0.5 transition-transform"
						/>
						Kembali
					</button>

					<h2 className="text-2xl font-extrabold text-gray-900 mb-1">
						Pendaftaran Akun
					</h2>
					<p className="text-sm text-gray-500">
						Daftarkan akun klien Anda untuk mulai menggunakan layanan.
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white  rounded-2xl border border-gray-100 shadow-sm p-7">
					<div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-5">
						<div>
							<h3 className="text-base font-semibold text-gray-900">
								Akun Klien
							</h3>
							<p className="text-xs text-gray-500 mt-0.5">
								Akun ini akan otomatis mendapatkan role{" "}
								<span className="font-semibold text-indigo-600">Client</span>.
							</p>
						</div>
					</div>

					<ClientRegForm />
				</div>

				{/* Footer */}
				<p className="text-center text-sm text-gray-500 mt-6">
					Sudah punya akun?{" "}
					<a
						href="/login/"
						className="text-blue-600 font-semibold hover:underline">
						Masuk
					</a>
				</p>
			</div>
		</div>
	);
};

export default ClientPageForm;
