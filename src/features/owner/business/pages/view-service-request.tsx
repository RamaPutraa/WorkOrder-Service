import { useBusiness } from "../hooks/use-business";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	User,
	ClipboardPenLine,
	Check,
	X,
	Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDialogStore } from "@/store/dialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";

const ViewServiceRequest = () => {
	const {
		data,
		loading,
		error,
		handleReject,
		handleApprove,
		filteredData,
		filterConfig,
	} = useBusiness();
	const navigate = useNavigate();
	const { showDialog } = useDialogStore();

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	const getStatusBadge = (status?: string) => {
		const s = status?.toLowerCase() || "";
		if (s === "approved")
			return (
				<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-emerald-600 ">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Disetujui
					</span>
				</div>
			);
		if (s === "rejected")
			return (
				<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-red-600 ">
					<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Ditolak
					</span>
				</div>
			);
		return (
			<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-amber-600 ">
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

			<div className="mb-6">
				<GenericFilter config={filterConfig} />
			</div>

			{/* Main Content */}
			<div className="w-full">
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
					<AnimatePresence mode="wait">
						{loading ?
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="col-span-full">
								<SectionLoading message="Memuat data pengajuan layanan..." />
							</motion.div>
						: filteredData.length > 0 ?
							filteredData.map((item) => (
								<motion.div
									key={item._id}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 2, y: 0 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(
												`/dashboard/internal/business/services/request/detail/${item._id}`,
											)
										}
										className="group flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
										{/* Header */}
										<div className="border-b border-slate-200/70 p-2">
											{/* Status Badge */}
											<div className="shrink-0">
												{getStatusBadge(item.servicesRequestStatus)}
											</div>
										</div>
										{/* card content 1 */}
										<div className="px-5 py-3 sm:px-6 pt-5 sm:pt-6 space-y-4">
											<div className="flex items-center justify-between gap-3 min-w-0">
												{/* Icon & Title Group */}
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<div className="shrink-0 p-2.5 sm:p-3 bg-primary/5 text-primary rounded-xl">
														<ClipboardPenLine className="w-5 h-5 sm:w-6 sm:h-6" />
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug truncate">
															{item.service?.title || "Untitled Form"}
														</h3>
													</div>
												</div>
											</div>

											<p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 md:min-h-[3.75rem]">
												{item.service?.description ||
													"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
												Lorem ipsum dolor sit amet consectetur adipisicing elit.
												Velit debitis voluptatem molestiae voluptatibus
												repellat? Dicta, minima a beatae voluptas nam eum
												tempora aut enim inventore numquam similique consequatur
												necessitatibus magnam. Porro labore dignissimos
												obcaecati cum earum velit iusto qui adipisci aperiam
												fugiat vel nam molestiae, saepe debitis amet maiores
												tempore! Molestias omnis enim, eius dignissimos tenetur
												quae. Accusantium, animi natus? Ipsam quos rerum
												deleniti quaerat odit temporibus dignissimos quasi
												deserunt quas totam perspiciatis laudantium veniam
												quibusdam, nesciunt dolores aut esse eligendi veritatis
												harum ratione ad minima dicta! Nam, obcaecati
												consequatur.
											</p>
										</div>
										{/* card content 2 */}
										<div className="px-6 py-2  flex flex-col justify-end">
											{/* Info Row (Client & Date) */}
											<div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1.5">
													<User className="w-3.5 h-3.5 shrink-0" />
													<span className="truncate max-w-[120px] sm:max-w-none">
														{item.requestedBy?.name ?? "-"}
													</span>
												</div>
												<div className="flex items-center gap-1.5">
													<Calendar className="w-3.5 h-3.5 shrink-0" />
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
										</div>
										{item.servicesRequestStatus === "approved" && (
											<div className="px-6 py-4 mt-auto flex flex-col justify-end border-t border-slate-200/70">
												{/* Info Row (Client & Date) */}
												<div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
													<div className="flex items-center gap-1.5">
														<Wrench className="w-6 h-6 shrink-0 bg-primary/5 text-primary rounded-full p-1" />
														<span className="truncate max-w-[120px] italic sm:max-w-none">
															Layanan sudah bisa diproses ke tahap selanjutnya.
														</span>
													</div>
												</div>
											</div>
										)}
										{/* card footer */}
										{item.servicesRequestStatus === "received" && (
											<div className="px-5 sm:px-6 py-4 mt-auto border-t border-slate-200/70">
												<div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
													{/* Tombol Terima & Tolak */}
													<div className="flex gap-2 flex-1">
														<Button
															size="sm"
															className="flex-1 gap-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-3 h-9 shadow-sm shadow-blue-200 transition-all flex items-center justify-center active:scale-95"
															onClick={(e) => {
																e.stopPropagation();
																showDialog({
																	title: "Konfirmasi Persetujuan",
																	description:
																		"Apakah kamu yakin ingin menyetujui layanan ini?",
																	confirmText: "Setujui",
																	cancelText: "Batal",
																	onConfirm: () => handleApprove(item._id),
																});
															}}>
															<Check className="w-4 h-4 shrink-0" />
															<span>Terima</span>
														</Button>

														<Button
															size="sm"
															className="flex-1 gap-1.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl px-3 h-9 shadow-sm shadow-red-200 transition-all flex items-center justify-center active:scale-95"
															onClick={(e) => {
																e.stopPropagation();
																showDialog({
																	title: "Konfirmasi Penolakan",
																	description:
																		"Apakah kamu yakin ingin menolak layanan ini?",
																	confirmText: "Tolak",
																	cancelText: "Batal",
																	onConfirm: () => handleReject(item._id),
																});
															}}>
															<X className="w-4 h-4 shrink-0" />
															<span>Tolak</span>
														</Button>
													</div>
												</div>
											</div>
										)}
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
			</div>
		</>
	);
};

export default ViewServiceRequest;
