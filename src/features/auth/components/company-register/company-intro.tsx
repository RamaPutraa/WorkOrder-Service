import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import loginImage from "@/assets/images/company-reg-landing-page.webp";

type Props = {
	onNext: () => void;
};

const highlights = [
	"Setup cepat, hanya 30 detik",
	"Tidak perlu kartu kredit",
	"Akses penuh fitur work order",
];

const CompanyIntro = ({ onNext }: Props) => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-white ">
			<div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* ── Left: Text ── */}
				<div>
					{/* Logo */}
					<div className="flex items-center gap-2 mb-10">
						<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
							<span className="text-white font-bold text-sm">W</span>
						</div>
						<span className="font-bold text-gray-900 text-lg tracking-tight">
							WorkOrder
						</span>
					</div>

					<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
						<Clock size={11} />
						Hanya 30 Detik
					</span>

					<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
						Daftarkan Perusahaan <br />
						<span className="text-blue-600">Anda Sekarang</span>
					</h1>

					<p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
						Mulai kelola work order perusahaan Anda secara digital. Gratis,
						mudah, dan siap digunakan dalam hitungan menit.
					</p>

					{/* Highlights */}
					<ul className="space-y-2.5 mb-10">
						{highlights.map((h, i) => (
							<li
								key={i}
								className="flex items-center gap-2.5 text-sm text-gray-700">
								<CheckCircle2 size={15} className="text-blue-500 shrink-0" />
								{h}
							</li>
						))}
					</ul>

					{/* CTA */}
					<div className="flex flex-col sm:flex-row items-start gap-3">
						<button
							onClick={onNext}
							className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
							Daftarkan Perusahaan
							<ArrowRight size={15} />
						</button>
						<a
							href="/login/"
							className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 rounded-xl transition-all">
							Sudah punya akun?
						</a>
					</div>
				</div>

				{/* ── Right: Image ── */}
				<div className="hidden lg:flex justify-center">
					<div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100">
						<img
							src={loginImage}
							alt="Company Registration"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CompanyIntro;
