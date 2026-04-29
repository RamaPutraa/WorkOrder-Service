import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Calendar, User, Ticket, ScrollText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { getNotificationsApi } from "@/features/notifications/services/notification-service";
import { useEffect, useState, useMemo } from "react";

const CompanyViewWo = () => {
	const { filteredData, filterConfig, loading, error } = useCompanyWo();
	const navigate = useNavigate();

	// ── Notifikasi: ambil daftar WO yang perlu aksi (laporan submitted) ──
	const [notifications, setNotifications] = useState<AppNotification[]>([]);

	useEffect(() => {
		getNotificationsApi()
			.then((res) => {
				setNotifications(res.data?.data ?? []);
			})
			.catch(() => {
				// Abaikan error notifikasi, tidak kritis
			});
	}, []);

	// Set berisi _id WO yang memiliki notifikasi status "submitted"
	const submittedWoIds = useMemo(() => {
		const ids = new Set<string>();
		for (const notif of notifications) {
			if (notif.data?.resource !== "work_order") continue;
			if (
				notif.data?.status !== "report_submited" &&
				notif.data?.status !== "completed_needed"
			)
				continue;
			// Backend mengirim "resourceId" (benar), fallback ke typo lama "reseurceId"
			const resourceId = notif.data?.resourceId || notif.data?.reseurceId;
			if (resourceId) ids.add(resourceId);
		}
		return ids;
	}, [notifications]);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	// Status badge configuration
	const getStatusConfig = (status: string) => {
		switch (status) {
			case "drafted":
				return {
					className: " text-gray-600",
					label: "Dirancang",
				};
			case "rejected":
				return {
					className: " text-red-600",
					label: "Ditolak",
				};
			case "sent":
				return {
					className: " text-blue-600",
					label: "Dikirim (Perlu persetujuan staff)",
				};
			case "approved":
				return {
					className: " text-green-600",
					label: "Disetujui (Perlu dimulai)",
				};
			case "unprocessable":
				return {
					className: " text-yellow-600",
					label: "Tidak dapat dikerjakan",
				};
			case "on_progress":
				return {
					className: " text-blue-600",
					label: "Sedang dikerjakan",
				};
			case "completed":
				return {
					className: " text-green-600",
					label: "Selesai",
				};
			case "cancelled":
				return {
					className: " text-red-600",
					label: "Dibatalkan",
				};
			case "failed":
				return {
					className: " text-red-600",
					label: "Gagal (Perintah kerja diselesaikan)",
				};
			default:
				return {
					className: " text-gray-600",
					label: status,
				};
		}
	};

	return (
		<>
			{/* Header Section */}
			<PageHeader
				title="Daftar Tugas Kerja"
				subtitle="Berikut merupakan daftar tugas kerja yang tersedia	"
				backPath={true}
			/>

			<div className="mb-6">
				<GenericFilter config={filterConfig} />
			</div>

			{/* Work Orders Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 xl:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="col-span-full">
							<SectionLoading message="Memuat data tugas kerja..." />
						</motion.div>
					: filteredData.length > 0 ?
						filteredData.map((wo, index) => {
							const statusConfig = getStatusConfig(wo.status);

							const needsAction = wo._id ? submittedWoIds.has(wo._id) : false;

							return (
								<motion.div
									key={wo._id ? `${wo._id}-${index}` : index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02, y: -4 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(
												`/dashboard/internal/workorders/detail/${wo._id}`,
											)
										}
										className="flex flex-col h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10 overflow-hidden hover:cursor-pointer">
										{/* Alert banner: perlu aksi */}
										{needsAction && (
											<div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-700 text-xs font-semibold">
												<AlertCircle className="w-3.5 h-3.5 shrink-0" />
												Tugas kerja ini perlu aksi
											</div>
										)}
										{/* Header */}
										<div className="p-5 ">
											<div className="flex items-center justify-between gap-3">
												<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
													<ScrollText className="w-6 h-6" />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="text-lg font-bold leading-tight mb-1 truncate">
														{wo.code || "-"}
													</h3>
													<p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
														{wo.service?.title || "-"}
													</p>
												</div>
											</div>
										</div>
										<div className="border-b border-boder/50"></div>
										{/* Content */}
										<div className="flex-1 flex flex-col gap-4 p-5 ">
											{/* Info Grid */}
											<div className="space-y-3">
												{/* status */}
												<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
													<div className="p-2 rounded-md bg-background">
														<Ticket className="w-4 h-4 text-primary" />
													</div>
													<div
														className={`flex-1 min-w-0  py-2 rounded-lg ${statusConfig.className}`}>
														{/* Label Header */}
														<p className="text-xs font-medium opacity-80 mb-0.5">
															Status Tugas Kerja
														</p>

														{/* Value Status */}
														<p className="text-sm font-semibold truncate">
															{statusConfig.label}
														</p>
													</div>
												</div>

												{/* Client Info */}
												<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
													<div className="p-2 rounded-md bg-background">
														<User className="w-4 h-4 text-primary" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-medium text-muted-foreground mb-0.5">
															Disetujui Oleh
														</p>
														{wo.approvedBy ?
															<p className="text-sm font-medium truncate">
																{wo.approvedBy?.name || "-"}
															</p>
														: wo.workOrderApprovalAccessType === "auto" ?
															<p className="text-sm font-medium truncate">
																Otomatis disetujui
															</p>
														:	<p className="text-sm font-medium truncate">
																Belum disetujui
															</p>
														}
													</div>
												</div>

												{/* Date Info */}
												<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
													<div className="p-2 rounded-md bg-background">
														<Calendar className="w-4 h-4 text-primary" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-medium text-muted-foreground mb-0.5">
															Dibuat Pada
														</p>
														<p className="text-sm font-medium">
															{new Date(wo.createdAt).toLocaleDateString(
																"id-ID",
																{
																	day: "2-digit",
																	month: "short",
																	year: "numeric",
																},
															)}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							);
						})
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

export default CompanyViewWo;
