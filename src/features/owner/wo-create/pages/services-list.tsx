import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Loader2, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SectionLoading } from "@/shared/atoms";
import { EmptyData } from "@/shared/molecules/empty-data";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import PageHeader from "@/shared/atoms/header-content";
import { useWoCreate } from "../hooks/useWoCreate";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

const WoServicesList: React.FC = () => {
	const navigate = useNavigate();
	const {
		loading,
		filteredData,
		filterConfig,
		fetchServices,
		createWorkOrder,
		creatingWo,
	} = useWoCreate();

	// Dialog state
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<Service | null>(null);

	useEffect(() => {
		void fetchServices();
	}, []);

	// const handleCreateWoClick = (service: Service) => {
	// 	setSelectedService(service);
	// 	setConfirmOpen(true);
	// };

	const handleConfirmCreate = async () => {
		if (!selectedService) return;
		const success = await createWorkOrder(selectedService._id);
		if (success) {
			setConfirmOpen(false);
			setSelectedService(null);
		}
	};

	const handleCancelCreate = () => {
		setConfirmOpen(false);
		setSelectedService(null);
	};

	const handleCreateWoClick = (e: React.MouseEvent, service: Service) => {
		e.stopPropagation(); // Menghalangi event klik sampai ke Card
		setSelectedService(service);
		setConfirmOpen(true);
	};

	return (
		<>
			{/* Header */}
			<PageHeader
				title="Buat Perintah Kerja"
				subtitle="Pilih layanan yang ingin Anda buatkan perintah kerja. Hanya layanan aktif yang ditampilkan."
				backPath={true}
			/>

			{/* Filter */}
			<div className="mb-6">
				<GenericFilter config={filterConfig} />
			</div>

			{/* Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="col-span-full">
							<SectionLoading message="Memuat data layanan..." />
						</motion.div>
					: filteredData.length > 0 ?
						filteredData.map((service) => (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.02, y: -4 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<div
									onClick={() =>
										navigate(
											`/dashboard/internal/wo-create/services/detail/${service._id}`,
										)
									}
									className="px-5 py-4 group gap-2 flex flex-col  bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:cursor-pointer ">
									<div className="space-y-4">
										{/* Top row */}
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-center gap-3 min-w-0">
												{/* Icon */}
												<div className="shrink-0 p-2.5 rounded-xl bg-primary/5 text-primary transition-colors">
													<ClipboardList className="w-6 h-6" />
												</div>
												{/* Title */}
												<h3 className="text-base font-bold text-slate-900 line-clamp-1">
													{service.title || "Untitled"}
												</h3>
											</div>
											{/* Status badge */}
											<div className="shrink-0 mt-1">
												<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
													<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
													<span className="text-[10px] font-bold uppercase tracking-wider">
														Aktif
													</span>
												</div>
											</div>
										</div>

										{/* Description */}
										<div className="text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
											{service.description ||
												"Tidak ada deskripsi tersedia untuk layanan ini."}
										</div>
									</div>

									<div className="grid grid-cols-1 text-xs  border-t border-slate-200/70 p-0">
										<div className="flex items-center justify-between text-xs text-slate-400 pt-3">
											{/* Badge akses */}
											<span>
												<Badge variant="outline">
													{serviceTypeLabel(service.accessType)}
												</Badge>
											</span>

											{/* Actions */}
											<div className="flex items-center gap-2">
												{/* Buat Perintah Kerja */}
												<Button
													size="sm"
													className="text-xs rounded-full gap-1.5 bg-primary hover:bg-primary/90 hover:cursor-pointer"
													// Kirim event 'e' ke fungsi
													onClick={(e) => handleCreateWoClick(e, service)}>
													<Send className="h-3.5 w-3.5" />
													Buat Perintah Kerja
												</Button>
											</div>
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

			{/* ─── Confirmation Dialog ─── */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-1">
							<div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
								<Send className="size-5" />
							</div>
							<DialogTitle className="text-base leading-snug">
								Konfirmasi Buat Perintah Kerja
							</DialogTitle>
						</div>
						<DialogDescription className="text-sm leading-relaxed">
							Anda akan membuat perintah kerja untuk layanan{" "}
							<span className="font-semibold text-foreground">
								&quot;{selectedService?.title}&quot;
							</span>
							. Tindakan ini akan langsung membuat work order baru berdasarkan
							layanan tersebut.
						</DialogDescription>
					</DialogHeader>

					{/* Info box */}
					<div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs leading-relaxed">
						<Info className="size-4 shrink-0 mt-0.5" />
						<p>
							Pastikan konfigurasi layanan sudah sesuai sebelum membuat perintah
							kerja. Perintah kerja yang dibuat akan langsung masuk ke daftar
							work order aktif.
						</p>
					</div>

					<DialogFooter className="gap-2 ">
						<Button
							variant="outline"
							onClick={handleCancelCreate}
							disabled={creatingWo}
							className="rounded-lg hover:cursor-pointer">
							Batal
						</Button>
						<Button
							onClick={handleConfirmCreate}
							disabled={creatingWo}
							className="rounded-lg hover:cursor-pointer">
							{creatingWo ?
								<>
									<Loader2 className="size-4 animate-spin" />
									Membuat...
								</>
							:	<>
									<Send className="size-4" />
									Ya, Buat Sekarang
								</>
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WoServicesList;
