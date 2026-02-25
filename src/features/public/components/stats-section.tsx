const stats = [
	{ value: "000+", label: "Lorem Ipsum" },
	{ value: "000+", label: "Lorem Ipsum" },
	{ value: "00.0%", label: "Lorem Ipsum" },
	{ value: "00%", label: "Lorem Ipsum" },
];

const StatsSection = () => {
	return (
		<section className="bg-blue-600 py-14">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
				{stats.map((s, i) => (
					<div key={i} className="text-center">
						<p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
							{s.value}
						</p>
						<p className="text-sm text-blue-100 font-medium">{s.label}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default StatsSection;
