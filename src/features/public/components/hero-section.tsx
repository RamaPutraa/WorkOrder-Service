import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../../assets/images/hero_image.jpg";

const HeroSection = () => {
	return (
		<section className="relative min-h-screen flex items-center bg-white">
			{/* Subtle background blobs */}
			<div
				className="absolute inset-0 pointer-events-none overflow-hidden"
				aria-hidden="true">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full opacity-60 translate-x-1/3 -translate-y-1/3" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full opacity-50 -translate-x-1/3 translate-y-1/3" />
			</div>

			<div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
				{/* ── Left: Text ── */}
				<div>
					<span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
						<span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
						Platform Work Order
					</span>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
						Kelola Work Order{" "}
						<span className="text-blue-600">Lebih Cerdas</span>, Lebih Efisien
					</h1>

					<p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
						Digitalisasi proses work order perusahaan Anda. Kurangi downtime,
						tingkatkan produktivitas tim, dan dapatkan visibilitas penuh atas
						setiap pekerjaan.
					</p>

					<div className="flex flex-wrap gap-4">
						<Link
							to="/company-regis"
							className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
							Mulai Gratis
							<ArrowRight size={16} />
						</Link>
						<Link
							to="/login/"
							className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 text-sm">
							Masuk ke Dasbor
						</Link>
					</div>

					<p className="mt-8 text-xs text-gray-400 flex items-center gap-1.5">
						<CheckCircle2 size={14} className="text-green-500" />
						Tidak perlu kartu kredit · Setup dalam 5 menit
					</p>
				</div>

				{/* ── Right: Hero Image ── */}
				<div className="relative hidden lg:flex justify-center items-center">
					<div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
						<img
							src={heroImage}
							alt="WorkOrder Hero"
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Floating badges */}
					<div className="absolute -top-3 -right-3 bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
						<span className="text-xs font-medium text-gray-700">
							Lorem Ipsum
						</span>
					</div>
					<div className="absolute -bottom-3 -left-3 bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2">
						<CheckCircle2 size={14} className="text-green-500" />
						<span className="text-xs font-medium text-gray-700">
							Lorem Ipsum
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
