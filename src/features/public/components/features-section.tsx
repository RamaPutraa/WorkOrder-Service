import {
	ClipboardList,
	Users,
	BarChart3,
	Zap,
	Shield,
	Clock,
} from "lucide-react";

const features = [
	{
		icon: ClipboardList,
		title: "Manajemen Work Order",
		desc: "Buat, assign, dan pantau work order secara real-time dalam satu dasbor terpusat.",
		color: "blue",
	},
	{
		icon: Users,
		title: "Manajemen Tim",
		desc: "Kelola technician, assign tugas, dan pantau produktivitas tim dengan mudah.",
		color: "indigo",
	},
	{
		icon: BarChart3,
		title: "Laporan & Analitik",
		desc: "Dapatkan insight mendalam dengan laporan otomatis dan visualisasi data real-time.",
		color: "blue",
	},
	{
		icon: Zap,
		title: "Notifikasi Real-time",
		desc: "Selalu up-to-date dengan notifikasi instan untuk setiap update status pekerjaan.",
		color: "indigo",
	},
	{
		icon: Shield,
		title: "Keamanan Data",
		desc: "Data perusahaan Anda terlindungi dengan enkripsi tingkat enterprise.",
		color: "blue",
	},
	{
		icon: Clock,
		title: "Jadwal Maintenance",
		desc: "Rencanakan preventive maintenance secara proaktif untuk menghindari downtime.",
		color: "indigo",
	},
];

const iconStyle: Record<string, string> = {
	blue: "bg-blue-50 text-blue-600",
	indigo: "bg-indigo-50 text-indigo-600",
};

const FeaturesSection = () => {
	return (
		<section className="py-24 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="text-center mb-16">
					<span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
						Fitur Unggulan
					</span>
					<h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
						Semua yang Anda butuhkan, dalam satu platform
					</h2>
					<p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
						Dirancang khusus untuk industri manufaktur dan jasa, WorkOrder
						menyederhanakan operasional harian Anda.
					</p>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((f, i) => {
						const Icon = f.icon;
						return (
							<div
								key={i}
								className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white">
								<div
									className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconStyle[f.color]}`}>
									<Icon size={20} />
								</div>
								<h3 className="font-semibold text-gray-900 mb-2 text-[15px]">
									{f.title}
								</h3>
								<p className="text-sm text-gray-500 leading-relaxed">
									{f.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
