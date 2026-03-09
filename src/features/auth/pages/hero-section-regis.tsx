import { ArrowRight, Building2, UserCircle2, CheckCircle2 } from "lucide-react";

const companyHighlights = [
	"Kelola work order tim secara digital",
	"Atur posisi, staf, dan layanan",
	"Dashboard analitik real-time",
];

const clientHighlights = [
	"Temukan layanan terpercaya",
	"Ajukan permintaan kerja dengan mudah",
	"Pantau status pekerjaan langsung",
];

const HeroRegis = () => {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 px-4 py-10">
			{/* 2-Column Cards */}
			<div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-5">
				{/* ── Card Kiri: Perusahaan ── */}
				<div className="group relative bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
					<div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700" />
					<div className="flex flex-col flex-1 p-8">
						<div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
							<Building2 size={22} className="text-blue-600" />
						</div>

						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full mb-4 self-start">
							Untuk Bisnis
						</span>

						<h2 className="text-xl font-bold text-slate-800 mb-2">
							Daftarkan sebagai Internal Perusahaan
						</h2>
						<p className="text-slate-500 text-sm leading-relaxed mb-6">
							Atur tim, kelola work order, dan tingkatkan produktivitas
							operasional bisnis Anda bersama platform kami.
						</p>

						<ul className="space-y-2.5 mb-8 flex-1">
							{companyHighlights.map((h, i) => (
								<li
									key={i}
									className="flex items-start gap-2.5 text-sm text-slate-600">
									<CheckCircle2
										size={14}
										className="text-blue-500 shrink-0 mt-0.5"
									/>
									{h}
								</li>
							))}
						</ul>

						<div>
							<a
								href="/company-regis"
								className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-md text-sm group/btn">
								Daftar Perusahaan
								<ArrowRight
									size={15}
									className="group-hover/btn:translate-x-0.5 transition-transform"
								/>
							</a>
							<p className="text-center text-xs text-slate-400 mt-3">
								Owner • Manager • Staff
							</p>
						</div>
					</div>
				</div>

				{/* ── Card Kanan: Client ── */}
				<div className="group relative bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
					<div className="h-1 w-full bg-gradient-to-r from-indigo-400 to-blue-500" />
					<div className="flex flex-col flex-1 p-8">
						<div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
							<UserCircle2 size={22} className="text-indigo-500" />
						</div>

						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full mb-4 self-start">
							Untuk Klien
						</span>

						<h2 className="text-xl font-bold text-slate-800 mb-2">
							Daftar sebagai Klien
						</h2>
						<p className="text-slate-500 text-sm leading-relaxed mb-6">
							Temukan dan ajukan permintaan layanan dari berbagai perusahaan
							terpercaya di platform kami.
						</p>

						<ul className="space-y-2.5 mb-8 flex-1">
							{clientHighlights.map((h, i) => (
								<li
									key={i}
									className="flex items-start gap-2.5 text-sm text-slate-600">
									<CheckCircle2
										size={14}
										className="text-indigo-400 shrink-0 mt-0.5"
									/>
									{h}
								</li>
							))}
						</ul>

						<div>
							<a
								href="/register"
								className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-600 font-semibold rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-200 text-sm group/btn">
								Daftar sebagai Klien
								<ArrowRight
									size={15}
									className="group-hover/btn:translate-x-0.5 transition-transform"
								/>
							</a>
							<p className="text-center text-xs text-slate-400 mt-3">
								Gratis • Tanpa biaya tersembunyi
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer link */}
			<p className="mt-8 text-sm text-slate-500">
				Sudah punya akun?{" "}
				<a
					href="/login"
					className="text-blue-600 font-semibold hover:underline">
					Masuk di sini
				</a>
			</p>
		</div>
	);
};

export default HeroRegis;
