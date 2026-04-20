import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useCreateService } from "../hooks/useCreateService";
import PageHeader from "@/shared/atoms/header-content";
import { Badge } from "@/components/ui/badge";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";

const ViewService: React.FC = () => {
	const navigate = useNavigate();
	const { loading, error, fecthServices, filteredData, filterConfig } =
		useCreateService();

	// Lazy loading - fetch services on mount
	useEffect(() => {
		void fecthServices();
	}, []);

	const serviceTypeLabel = (type: any) => {
		const strType = String(type).toLowerCase();
		switch (strType) {
			case "internal":
			case "2":
				return "Internal";
			case "public":
			case "0":
				return "Publik";
			case "member_only":
			case "1":
				return "Berlangganan";
			default:
				return strType;
		}
	};

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			{/* header */}
			<PageHeader
				title="List Data Layanan"
				subtitle="Berikut merupakan list layanan yang dimiliki oleh perusahaan."
				onAddClick={() => navigate("/dashboard/internal/services/create")}
				addLabel="Tambah Layanan"
				backPath={true}
			/>

			<div className="mb-6">
				<GenericFilter config={filterConfig} />
			</div>

			{/* Main Content - Services Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="col-span-full">
							<SectionLoading message="Memuat data service..." />
						</motion.div>
					: filteredData.length > 0 ?
						filteredData.map((service) => (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<div
									onClick={() =>
										navigate(
											`/dashboard/internal/services/detail/${service._id}`,
										)
									}
									className=" group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:cursor-pointer">
									<div className=" space-y-4">
										{/* Header */}
										<div className="border-b border-slate-200/70 ">
											{/* Status Badge */}
											{service.isActive ?
												<div className="flex items-center gap-1.5 px-5 py-2  text-emerald-600 ">
													<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
													<span className="text-[10px] font-bold uppercase tracking-wider">
														Aktif
													</span>
												</div>
											:	<div className="flex items-center gap-1.5 px-5 py-2  text-slate-500 ">
													<span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
													<span className="text-[10px] font-bold uppercase tracking-wider">
														Nonaktif
													</span>
												</div>
											}
										</div>
										{/* Baris Atas: Icon, Judul, dan Status */}
										<div className="flex items-start justify-between gap-4 px-5 py-2">
											<div className="flex items-center gap-3 min-w-0">
												{/* Icon */}
												<div className="shrink-0 p-2.5 rounded-xl bg-primary/5 text-primary  transition-colors">
													<ClipboardList className="w-6 h-6" />
												</div>

												{/* Judul dengan min-height agar sejajar antar card */}
												<h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center">
													{service.title || "Untitled Form"}
												</h3>
											</div>
										</div>

										{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
										<div className="px-5 text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
											{service.description ||
												"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
											Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Voluptatum a quod quos consectetur minus sunt, id
											voluptate voluptas, provident deserunt earum hic,
											laboriosam sequi eum assumenda est! Dolore, eius amet!
											Similique mollitia exercitationem consequuntur cupiditate
											necessitatibus atque voluptate rem, autem voluptatem!
											Ipsum, quibusdam asperiores, inventore in architecto nobis
											provident modi, dolorum officia rerum deserunt repellendus
											quo optio sequi iure aliquam. Magnam mollitia vel nihil
											distinctio quas cumque quisquam ea. Quisquam consectetur,
											expedita magni assumenda quae vel, sequi blanditiis sed
											quia similique ducimus nostrum molestiae dolore
											reprehenderit dicta corporis beatae rerum.
										</div>
									</div>

									<div className="grid grid-cols-1 text-xs py-3 px-5 border-t border-slate-200/70 p-0">
										<div className=" flex items-center justify-between text-xs text-slate-400 ">
											<span className="tracking-wide uppercase">
												<Badge variant="outline">
													{serviceTypeLabel(service.accessType)}
												</Badge>
											</span>
										</div>
									</div>
								</div>
							</motion.div>
						))
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<EmptyData />
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewService;
