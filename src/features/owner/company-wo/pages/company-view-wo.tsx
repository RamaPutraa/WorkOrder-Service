import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileCheck, Ticket, ScrollText } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";

const CompanyViewWo = () => {
	const { filteredData, filterConfig, loading, error } = useCompanyWo();
	const navigate = useNavigate();

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
			case "draft":
				return {
					className: " text-gray-600",
					label: "Dirancang",
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
			case "onProgress":
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
										{/* Header */}
										<CardHeader className="pb-3">
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
												{/* <div
													className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${statusConfig.className}`}>
													{statusConfig.label}
												</div> */}
											</div>
										</CardHeader>

										{/* Content */}
										<CardContent className="flex-1 flex flex-col gap-4 pt-0">
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
														<p className="text-sm font-medium truncate">
															{wo.approvedBy?.name || "-"}
														</p>
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

												<Separator />
											</div>

											{/* Action Buttons */}
											<div className="grid grid-cols-1  mt-auto">
												<Button
													className="h-10 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 font-medium hover:cursor-pointer"
													onClick={() =>
														navigate(
															`/dashboard/internal/workorders/${wo._id}/report`,
														)
													}>
													<FileCheck className="w-4 h-4 mr-1" />
													Laporan Pengerjaan
												</Button>
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
