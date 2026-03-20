import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	User,
	Eye,
	FileText,
	FileCheck,
	Ticket,
	ScrollText,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";

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
		switch (status.toLowerCase()) {
			case "drafted":
				return {
					className: "bg-gray-100 text-gray-700 border border-gray-200",
					label: "Dirancang",
				};
			case "ready":
				return {
					className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
					label: "Siap Dikerjakan",
				};
			case "in_progress":
				return {
					className: "bg-blue-100 text-blue-700 border border-blue-200",
					label: "Sedang Dikerjakan",
				};
			case "completed":
				return {
					className: "bg-green-100 text-green-700 border border-green-200",
					label: "Selesai",
				};
			case "cancelled":
				return {
					className: "bg-red-100 text-red-700 border border-red-200",
					label: "Dibatalkan",
				};
			default:
				return {
					className: "bg-gray-100 text-gray-700 border border-gray-200",
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
									<Card className="flex flex-col h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10 overflow-hidden">
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
												<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
													<div className="p-2 rounded-md bg-background">
														<Ticket className="w-4 h-4 text-primary" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-medium text-muted-foreground mb-0.5">
															Status Tugas Kerja
														</p>
														<p className="text-sm font-medium truncate">
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
															Manager
														</p>
														<p className="text-sm font-medium truncate">
															{wo.createdBy?.name || "-"}
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
											<div className="grid grid-cols-2 gap-2 mt-auto">
												<Button
													variant="outline"
													className="h-10 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 font-medium"
													onClick={() =>
														navigate(
															`/dashboard/internal/workorders/detail/${wo._id}`,
														)
													}>
													<Eye className="w-4 h-4 mr-1" />
													Detail
												</Button>
												<Button
													className="h-10 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 font-medium"
													onClick={() =>
														navigate(
															`/dashboard/internal/workorders/${wo._id}/report`,
														)
													}>
													<FileCheck className="w-4 h-4 mr-1" />
													Laporan
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
							<Card className="p-12 text-center border-dashed border-2 rounded-lg">
								<div className="flex flex-col items-center gap-3">
									<div className="p-4 rounded-full bg-muted">
										<FileText className="w-8 h-8 text-muted-foreground" />
									</div>
									<div>
										<p className="text-base font-medium text-muted-foreground">
											Belum ada data work order
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											Work order akan muncul di sini setelah dibuat
										</p>
									</div>
								</div>
							</Card>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default CompanyViewWo;
