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
import { Skeleton } from "@/components/ui/skeleton";

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

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "approved":
				return "border-l-4 border-l-green-600";
			case "rejected":
				return "border-l-4 border-l-red-600";
			default:
				return "border-l-4 border-l-yellow-500";
		}
	};

	const renderStatusBadge = (status: string) => {
		const s = status.toLowerCase();
		if (s === "approved")
			return (
				<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200">
					<CheckCircle className="w-3.5 h-3.5" />
					<span className="text-xs font-semibold">Disetujui</span>
				</div>
			);
		if (s === "rejected")
			return (
				<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200">
					<XCircle className="w-3.5 h-3.5" />
					<span className="text-xs font-semibold">Ditolak</span>
				</div>
			);
		return (
			<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200">
				<Clock className="w-3.5 h-3.5" />
				<span className="text-xs font-semibold">Menunggu</span>
			</div>
		);
	};

	return (
		<>
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div className="flex items-center space-x-4">
					{/* Back Button */}
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>

					{/* Title Section */}
					<div className="flex flex-col space-y-1">
						<h1 className="text-2xl font-bold">Pengajuan Layanan</h1>
						<p className="text-muted-foreground text-sm sm:text-base">
							Berikut merupakan layanan yang diajukan oleh pelanggan.
						</p>
					</div>
				</div>
			</div>

			{/* Main Content - Service Requests Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
				<AnimatePresence mode="wait">
					{loading ?
						Array.from({ length: 4 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<Card className="p-5 flex flex-col justify-between border shadow-sm rounded-lg">
									<div>
										<Skeleton className="h-6 w-3/4 mb-3 rounded" />
										<Skeleton className="h-4 w-full mb-2 rounded" />
										<Skeleton className="h-4 w-2/3 mb-4 rounded" />
										<div className="grid grid-cols-2 gap-4">
											<Skeleton className="h-20 w-full rounded" />
											<Skeleton className="h-20 w-full rounded" />
										</div>
									</div>
									<div className="grid grid-cols-6 gap-2 mt-4">
										<Skeleton className="h-10 w-full col-span-4 rounded-lg" />
										<Skeleton className="h-10 w-full col-span-1 rounded-lg" />
										<Skeleton className="h-10 w-full col-span-1 rounded-lg" />
									</div>
								</Card>
							</motion.div>
						))
					: data.length > 0 ?
						data.map((item) => (
							<motion.div
								key={item._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.01, y: -4 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<Card
									className={`p-5 flex flex-col justify-between h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10 ${getStatusColor(
										item.status,
									)}`}>
									{/* Header */}
									<CardHeader className="p-0 mb-4">
										<CardTitle className="text-lg font-bold leading-tight">
											{item.service?.title}
										</CardTitle>
										<CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-2">
											{item.service?.description || "Tidak ada deskripsi"}
										</CardDescription>
									</CardHeader>

									{/* Content */}
									<CardContent className="p-0 space-y-4">
										{/* Info Grid */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{/* Left Column */}
											<div className="space-y-3">
												{/* Status */}
												<div className="flex flex-col gap-1.5">
													<span className="text-xs font-medium text-muted-foreground">
														Status
													</span>
													{renderStatusBadge(item.status)}
												</div>

												{/* Client */}
												<div className="flex flex-col gap-1.5">
													<span className="text-xs font-medium text-muted-foreground">
														Pelanggan
													</span>
													<div className="flex items-center gap-2 text-sm">
														<User className="w-4 h-4 text-primary" />
														<span className="font-medium">
															{item.client?.name}
														</span>
													</div>
												</div>
											</div>

											{/* Right Column */}
											<div className="space-y-3">
												{/* Created Date */}
												<div className="flex flex-col gap-1.5">
													<span className="text-xs font-medium text-muted-foreground">
														Dibuat
													</span>
													<div className="flex items-center gap-2 text-sm">
														<Calendar className="w-4 h-4 text-blue-600" />
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

												{/* Updated Date */}
												<div className="flex flex-col gap-1.5">
													<span className="text-xs font-medium text-muted-foreground">
														Diperbarui
													</span>
													<div className="flex items-center gap-2 text-sm">
														<Clock className="w-4 h-4 text-green-600" />
														<span>
															{new Date(item.updatedAt).toLocaleDateString(
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
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex flex-col sm:flex-row gap-2 pt-2">
											{/* View Detail Button - Full width on mobile, flex-1 on desktop */}
											<Button
												variant="outline"
												className="flex-1 h-10 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium"
												onClick={() =>
													navigate(
														`/dashboard/internal/business/services/request/detail/${item._id}`,
													)
												}>
												<Eye className="w-4 h-4 mr-2" />
												Lihat Detail
											</Button>

											{/* Approve/Reject Buttons Container */}
											<div className="flex gap-2">
												{/* Approve Button */}
												<Button
													variant="outline"
													className="flex-1 sm:w-auto h-10 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 font-medium"
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
													<CheckCircle className="w-4 h-4 sm:mr-0 mr-2" />
													<span className="sm:hidden">Setujui</span>
												</Button>

												{/* Reject Button */}
												<Button
													variant="outline"
													className="flex-1 sm:w-auto h-10 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
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
													<XCircle className="w-4 h-4 sm:mr-0 mr-2" />
													<span className="sm:hidden">Tolak</span>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<Card className="p-12 text-center border-dashed border-2 rounded-lg">
								<p className="text-muted-foreground text-base">
									Belum ada pengajuan layanan.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
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
