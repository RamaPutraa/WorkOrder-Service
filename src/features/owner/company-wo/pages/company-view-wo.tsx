import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Calendar, User, Ticket, ScrollText, CheckCircle2, Timer } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { useEffect, useState } from "react";
import { getWorkOrderReport } from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";

const CompanyViewWo = () => {
	const { filteredData, filterConfig, loading, error } = useCompanyWo();
	const navigate = useNavigate();
	// workReportMap: woId -> WorkReport (hanya untuk WO on_progress/completed/failed)
	const [workReportMap, setWorkReportMap] = useState<Record<string, WorkReport>>({});

	// Fetch work reports secara paralel untuk WO yang relevan
	useEffect(() => {
		if (!filteredData || filteredData.length === 0) return;
		const relevantWos = filteredData.filter((wo) =>
			["on_progress", "completed", "failed"].includes(wo.status),
		);
		if (relevantWos.length === 0) return;

		const fetchAll = async () => {
			const results = await Promise.all(
				relevantWos.map(async (wo) => {
					const { data: res } = await handleApi(() => getWorkOrderReport(wo._id));
					if (res?.data) return { id: wo._id, report: res.data as WorkReport };
					return null;
				}),
			);
			const map: Record<string, WorkReport> = {};
			results.forEach((r) => {
				if (r) map[r.id] = r.report;
			});
			setWorkReportMap(map);
		};
		void fetchAll();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredData]);

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
					label: "Dikirim",
				};
			case "approved":
				return {
					className: " text-green-600",
					label: "Disetujui",
				};
			case "unprocessable":
				return {
					className: " text-yellow-600",
					label: "Belum dapat dikerjakan",
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
					label: "Gagal",
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
			<div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
						filteredData.map((wo) => {
							const statusConfig = getStatusConfig(wo.status);
							const report = workReportMap[wo._id] ?? null;
							// Kondisi alert work report
							const showNeedComplete =
								report?.workReportApprovalAccessType === "auto" &&
								report?.status === "approved";
							const showNeedApproval =
								report?.workReportApprovalAccessType === "manager" &&
								report?.status === "submitted";

							return (
								<motion.div
									key={wo._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02, y: -4 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<Card
										onClick={() =>
											navigate(
												`/dashboard/internal/workorders/detail/${wo._id}`,
											)
										}
										className="flex flex-col h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10 overflow-hidden hover:cursor-pointer">
										{/* Report Action Banner */}
										{showNeedComplete && (
											<div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-b border-green-200">
												<CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
												<p className="text-xs font-semibold text-green-700">
													Tugas kerja perlu diselesaikan
												</p>
											</div>
										)}
										{showNeedApproval && (
											<div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200">
												<Timer className="w-3.5 h-3.5 text-amber-600 shrink-0" />
												<p className="text-xs font-semibold text-amber-700">
													Tugas kerja perlu disetujui
												</p>
											</div>
										)}
										{/* Header */}
										<CardHeader className="pb-0 ">
											<div className="flex items-center justify-between gap-3">
												<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
													<ScrollText className="w-6 h-6" />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="text-lg font-bold leading-tight mb-1 truncate">
														{wo.service?.title}
													</h3>
													<p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
														{wo.service?.description || "-"}
													</p>
												</div>
											</div>
										</CardHeader>
										<div className="border-b border-boder/10 mx-6"></div>
										{/* Content */}
										<CardContent className="flex-1 flex flex-col gap-4 pt-0 ">
											{/* Info Grid */}
											<div className="space-y-3">
												{/* status */}
												<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
													<div className="p-2 rounded-md bg-background">
														<Ticket className="w-4 h-4 text-primary" />
													</div>
													<div
														className={`flex-1 min-w-0 px-3 py-2 rounded-lg ${statusConfig.className}`}>
														{/* Label Header */}
														<p className="text-xs font-medium opacity-80 mb-0.5">
															Status Tugas Kerja
														</p>

														{/* Value Status */}
														<p className="text-sm font-bold truncate">
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
										</CardContent>
									</Card>
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
