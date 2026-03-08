import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, ScrollText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { SectionLoading } from "@/shared/atoms";
import { useCreateService } from "../hooks/useCreateService";
import PageHeader from "@/shared/atoms/header-content";
import { Badge } from "@/components/ui/badge";

const ViewService: React.FC = () => {
	const navigate = useNavigate();
	const { services, loading, error, fecthServices } = useCreateService();

	// Lazy loading - fetch services on mount
	useEffect(() => {
		void fecthServices();
	}, []);

	const serviceTypeLabel = (type: string) => {
		switch (type?.toLowerCase()) {
			case "internal":
				return "Internal";
			case "public":
				return "Publik";
			default:
				return type;
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
					: services.length > 0 ?
						services.map((service) => (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<Card className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
									<CardHeader className=" space-y-4">
										{/* Baris Atas: Icon, Judul, dan Status */}
										<div className="flex items-start justify-between gap-4">
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

											{/* Status Badge di pojok kanan atas */}
											<div className="shrink-0 mt-1">
												{service.isActive ?
													<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
														<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
														<span className="text-[10px] font-bold uppercase tracking-wider">
															Aktif
														</span>
													</div>
												:	<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100">
														<span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
														<span className="text-[10px] font-bold uppercase tracking-wider">
															Nonaktif
														</span>
													</div>
												}
											</div>
										</div>

										{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
										<div className="text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
											{service.description ||
												"Tidak ada deskripsi tersedia untuk layanan ini."}
										</div>
									</CardHeader>

									<CardFooter className="grid grid-cols-1 text-xs mx-6 border-t border-slate-200/70 p-0">
										<div className=" flex items-center justify-between text-xs text-slate-400 ">
											<span className="tracking-wide uppercase">
												<Badge variant="outline">
													{serviceTypeLabel(service.accessType)}
												</Badge>
											</span>

											{/* Status Dot */}
											<div className="flex items-center gap-2">
												{/* Action */}
												<Button
													variant="ghost"
													size="sm"
													className="text-xs rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
													onClick={() =>
														navigate(
															`/dashboard/internal/services/detail/${service._id}`,
														)
													}>
													Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardFooter>
								</Card>
							</motion.div>
						))
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<Card className="p-12 text-center border-dashed border-2 rounded-lg">
								<p className="text-muted-foreground text-base">
									Tidak ada data service tersedia.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									Klik tombol "Tambah Layanan" untuk membuat service baru.
								</p>
							</Card>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewService;
