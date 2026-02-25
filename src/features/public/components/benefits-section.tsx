import { CheckCircle2 } from "lucide-react";

const benefits = [
	"Kurangi downtime mesin hingga 60%",
	"Otomasi penugasan teknisi",
	"Histori pekerjaan yang terarsip rapi",
	"Akses dari perangkat apa pun",
	"Integrasi dengan sistem yang sudah ada",
	"Dukungan tim 24/7",
];

const metricCards = [
	{
		value: "60%",
		label: "Penurunan Downtime",
		icon: "⬇️",
		style: "bg-blue-600 text-white",
		labelStyle: "text-blue-100",
	},
	{
		value: "3x",
		label: "Kecepatan Respons",
		icon: "⚡",
		style: "bg-white border border-gray-100",
		labelStyle: "text-gray-500",
	},
	{
		value: "100%",
		label: "Visibilitas Real-time",
		icon: "📊",
		style: "bg-white border border-gray-100",
		labelStyle: "text-gray-500",
	},
	{
		value: "24/7",
		label: "Support Tim Kami",
		icon: "🛡️",
		style: "bg-blue-50 border border-blue-100",
		labelStyle: "text-blue-400",
	},
];

const BenefitsSection = () => {
	return (
		<section className="py-24 bg-gray-50">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				{/* Left — Text */}
				<div>
					<span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
						Kenapa WorkOrder?
					</span>
					<h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-6">
						Tingkatkan efisiensi operasional Anda
					</h2>
					<p className="text-gray-500 mb-8 leading-relaxed text-sm">
						Ribuan perusahaan telah mempercayakan operasional work order mereka
						kepada WorkOrder. Bergabunglah dan rasakan perbedaannya.
					</p>
					<ul className="space-y-3">
						{benefits.map((b, i) => (
							<li
								key={i}
								className="flex items-center gap-3 text-sm text-gray-700">
								<CheckCircle2 size={16} className="text-blue-500 shrink-0" />
								{b}
							</li>
						))}
					</ul>
				</div>

				{/* Right — Metric Cards Grid */}
				<div className="grid grid-cols-2 gap-4">
					{metricCards.map((card, i) => (
						<div
							key={i}
							className={`${card.style} rounded-2xl p-6 shadow-sm flex flex-col gap-2`}>
							<span className="text-2xl">{card.icon}</span>
							<span
								className={`text-3xl font-extrabold ${card.style.includes("blue-600") ? "text-white" : "text-gray-900"}`}>
								{card.value}
							</span>
							<span className={`text-xs font-medium ${card.labelStyle}`}>
								{card.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default BenefitsSection;
