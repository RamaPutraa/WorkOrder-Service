import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { useBusiness } from "../hooks/use-business";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Clock,
	Eye,
	CheckCircle,
	XCircle,
	ChevronLeft,
	User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialogStore } from "@/store/dialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";

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
				<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
					<CheckCircle className="w-3 h-3" />
					Disetujui
				</span>
			);
		if (s === "rejected")
			return (
				<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-medium">
					<XCircle className="w-3 h-3" />
					Ditolak
				</span>
			);
		return (
			<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
				<Clock className="w-3 h-3" />
				Menunggu
			</span>
		);
	};

	return (
		<>
			{/* Header Section */}
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Pengajuan Layanan</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Berikut merupakan layanan yang diajukan oleh pelanggan.
					</p>
				</div>
			</div>

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
								<Card className="flex flex-col h-full border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<CardTitle className="text-base font-semibold leading-snug truncate">
													{item.service?.title}
												</CardTitle>
												<CardDescription className="text-sm leading-relaxed line-clamp-2 mt-1">
													{item.service?.description || "Tidak ada deskripsi"}
												</CardDescription>
											</div>
											{getStatusBadge(item.status)}
										</div>
									</CardHeader>

									<CardContent className="pt-0 space-y-4">
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
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-1.5"
												onClick={() =>
													navigate(
														`/dashboard/internal/business/services/request/detail/${item._id}`,
													)
												}>
												<Eye className="w-4 h-4" />
												Lihat Detail
											</Button>

											<Button
												size="sm"
												className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
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
												size="sm"
												className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
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
