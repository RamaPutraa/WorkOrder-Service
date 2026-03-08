import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useBusiness } from "../hooks/use-business";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Eye,
	CheckCircle,
	XCircle,
	User,
	ClipboardPenLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialogStore } from "@/store/dialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";

const ViewServiceRequest = () => {
	const { data, loading, error, handleReject, handleApprove } = useBusiness();
	const navigate = useNavigate();
	const { showDialog } = useDialogStore();

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		const s = status.toLowerCase();
		if (s === "approved")
			return (
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Disetujui
					</span>
				</div>
			);
		if (s === "rejected")
			return (
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
					<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Ditolak
					</span>
				</div>
			);
		return (
			<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
				<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
				<span className="text-[10px] font-bold uppercase tracking-wider">
					Menunggu
				</span>
			</div>
		);
	};

	return (
		<>
			{/* Header Section */}
			<PageHeader
				title="Pengajuan Layanan"
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Daftar Pengajuan Layanan - Total{" "}
							<TextLoading variant="dots" message="" className="w-4" />{" "}
						</div>
					:	`Daftar Pengajuan Layanan - Total ${data?.length || 0} pengajuan layanan`
				}
				backPath={true}
			/>

			{/* Main Content */}
			<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="col-span-full">
							<SectionLoading message="Memuat data pengajuan layanan..." />
						</motion.div>
					: data.length > 0 ?
						data.map((item) => (
							<motion.div
								key={item._id}
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
													<ClipboardPenLine className="w-6 h-6" />
												</div>

												{/* Judul dengan min-height agar sejajar antar card */}
												<h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center">
													{item.service?.title || "Untitled Form"}
												</h3>
											</div>

											{/* Status Badge di pojok kanan atas */}
											<div className="shrink-0 mt-1">
												{getStatusBadge(item.status)}
											</div>
										</div>

										{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
										<div className="text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[2.75rem] text-justify">
											{item.service?.description ||
												"Tidak ada deskripsi tersedia untuk layanan ini."}
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										{/* Info Row */}
										<div className="flex items-center gap-6 text-sm text-muted-foreground">
											<div className="flex items-center gap-1.5">
												<User className="w-3.5 h-3.5" />
												<span>{item.client?.name ?? "-"}</span>
											</div>
											<div className="flex items-center gap-1.5">
												<Calendar className="w-3.5 h-3.5" />
												<span>
													{new Date(item.createdAt).toLocaleDateString(
														"id-ID",
														{
															day: "2-digit",
															month: "short",
															year: "numeric",
														},
													)}
												</span>
											</div>
										</div>

										{/* Divider */}
										<div className="border-t" />

										{/* Action Buttons */}
										<div className="flex gap-2 w-full">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
												onClick={() =>
													navigate(
														`/dashboard/internal/business/services/request/detail/${item._id}`,
													)
												}>
												<Eye className="w-4 h-4" />
												Lihat Detail
											</Button>

											<Button
												variant="ghost" // Gunakan ghost agar base style bawaan hilang, kita timpa dengan custom class di bawah
												size="sm"
												className="flex-1 gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
												onClick={() =>
													showDialog({
														title: "Konfirmasi Persetujuan",
														description:
															"Apakah kamu yakin ingin menyetujui layanan ini?",
														confirmText: "Setujui",
														cancelText: "Batal",
														onConfirm: () => handleApprove(item._id),
													})
												}>
												<CheckCircle className="w-4 h-4" />
												Terima
											</Button>

											<Button
												variant="ghost"
												size="sm"
												className="flex-1 gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
												onClick={() =>
													showDialog({
														title: "Konfirmasi Penolakan",
														description:
															"Apakah kamu yakin ingin menolak layanan ini?",
														confirmText: "Tolak",
														cancelText: "Batal",
														onConfirm: () => handleReject(item._id),
													})
												}>
												<XCircle className="w-4 h-4" />
												Tolak
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<Card className="p-12 text-center border-dashed border-2 rounded-xl">
								<p className="text-muted-foreground">
									Belum ada pengajuan layanan.
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Pengajuan layanan dari pelanggan akan muncul di sini.
								</p>
							</Card>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewServiceRequest;
