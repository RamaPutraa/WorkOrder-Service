import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
	return (
		<section className="py-24 bg-white">
			<div className="max-w-3xl mx-auto px-6 text-center">
				<h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
					Siap untuk memulai?
				</h2>
				<p className="text-gray-500 mb-10 text-base leading-relaxed">
					Daftar gratis sekarang dan rasakan bagaimana WorkOrder mengubah cara
					perusahaan Anda beroperasi.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Link
						to="/company-regis"
						className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
						Daftar Perusahaan Gratis
						<ArrowRight size={16} />
					</Link>
					<Link
						to="/login/"
						className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all text-sm">
						Sudah punya akun? Masuk
					</Link>
				</div>
			</div>
		</section>
	);
};

export default CtaSection;
