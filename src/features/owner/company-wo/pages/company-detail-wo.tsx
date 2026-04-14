import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import StaffAssigned from "../components/staff-assigned";
import { StatusBadge } from "../components/wo-status-badge";
import { InfoRow } from "../components/wo-info-row";
import { SiblingCard } from "../components/wo-sibling-card";
import { WoFormInfo } from "../components/wo-form-info";
import {
	Calendar,
	User,
	CheckCircle2,
	Play,
	Shield,
	AlertTriangle,
	XCircle,
	FileText,
	Settings2,
	ArrowLeftRight,
	CheckCircle2Icon,
	Info,
	Ban,
	Timer,
	PlusIcon,
	Eye,
	CircleCheckBig,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	approveWorkOrderApi,
	cancelWorkOrderApi,
	completeWorkOrderApi,
	failWorkOrderApi,
	rejectWorkOrderApi,
	sendWorkOrderApi,
	startWorkOrderApi,
} from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useDialogStore } from "@/store/dialogStore";
import { useAuthStore } from "@/store/authStore";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null | undefined) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
};

// ─── Main Component ────────────────────────────────────────────────────────────

const CompanyDetailWo = () => {
	const navigate = useNavigate();
	const {
		detailData,
		fecthDetailInternalCompanyWorkOrder,
		loading,
		employees,
		fetchEmployeeList,
	} = useCompanyWo();
	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();

	const isReadOnly = user?.role === "staff_company";

	const [isSticky, setIsSticky] = useState(false);
	const [isSubmittingReady, setIsSubmittingReady] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [isFailDialogOpen, setIsFailDialogOpen] = useState(false);
	const [failIssue, setFailIssue] = useState("");
	const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
	const [completeIssue, setCompleteIssue] = useState("");

	// Detect scroll for sticky header
	useEffect(() => {
		const handleScroll = () => setIsSticky(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// ── Handlers ────────────────────────────────────────────────────
	const handleSendWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Konfigurasi Selesai",
			description:
				"Apakah Anda yakin konfigurasi sudah selesai dan siap untuk memulai perintah kerja?",
			confirmText: "Ya, Selesai",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSubmittingReady(true);
				const { error } = await handleApi(() =>
					sendWorkOrderApi(wo?._id ?? ""),
				);
				setIsSubmittingReady(false);
				if (error) {
					notifyError("Gagal menandai konfigurasi selesai", error.message);
					return;
				}
				notifySuccess("Konfigurasi Selesai", "Work order siap untuk dimulai");
				if (wo?._id) {
					fecthDetailInternalCompanyWorkOrder(wo._id);
				}
			},
		});
	};

	const handleStartWorkOrder = () => {
		showDialog({
			title: "Mulai Perintah Kerja",
			description:
				"Apakah Anda yakin ingin memulai perintah kerja ini? Status akan berubah menjadi 'Sedang Dikerjakan'.",
			confirmText: "Ya, Mulai",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsStarting(true);
				const { error } = await handleApi(() =>
					startWorkOrderApi(wo?._id ?? ""),
				);
				setIsStarting(false);
				if (error) {
					notifyError("Gagal memulai perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Dimulai", "Perintah kerja telah dimulai");
				if (wo?._id) {
					fecthDetailInternalCompanyWorkOrder(wo._id);
				}
			},
		});
	};

	const handleApproveWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Persetujuan",
			description:
				"Apakah Anda yakin ingin menyetujui perintah kerja ini? Status akan berubah menjadi 'Disetujui'.",
			confirmText: "Ya, Setujui",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsStarting(true);
				const { error } = await handleApi(() =>
					approveWorkOrderApi(wo?._id ?? ""),
				);
				setIsStarting(false);
				if (error) {
					notifyError("Gagal menyetujui perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Disetujui", "Perintah kerja telah disetujui");
				if (wo?._id) {
					fecthDetailInternalCompanyWorkOrder(wo._id);
				}
			},
		});
	};

	const handleRejectWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Penolakan",
			description:
				"Apakah Anda yakin ingin menolak perintah kerja ini? Status akan berubah menjadi 'Ditolak'.",
			confirmText: "Ya, Tolak",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsStarting(true);
				const { error } = await handleApi(() =>
					rejectWorkOrderApi(wo?._id ?? ""),
				);
				setIsStarting(false);
				if (error) {
					notifyError("Gagal menolak perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Ditolak", "Perintah kerja telah ditolak");
				if (wo?._id) {
					fecthDetailInternalCompanyWorkOrder(wo._id);
				}
			},
		});
	};

	const handleCompleteWorkOrder = async () => {
		setIsStarting(true);
		const { error } = await handleApi(() =>
			completeWorkOrderApi(wo?._id ?? "", { issue: completeIssue }),
		);
		setIsStarting(false);
		if (error) {
			notifyError("Gagal menyelesaikan perintah kerja", error.message);
			return;
		}
		notifySuccess("Berhasil Selesai", "Perintah kerja telah selesai");
		setIsCompleteDialogOpen(false);
		setCompleteIssue("");
		if (wo?._id) {
			fecthDetailInternalCompanyWorkOrder(wo._id);
		}
	};

	const handleCancelWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Pembatalan",
			description:
				"Apakah Anda yakin ingin membatalkan perintah kerja ini? Status akan berubah menjadi 'Dibatalkan'.",
			confirmText: "Ya, Batalkan",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsStarting(true);
				const { error } = await handleApi(() =>
					cancelWorkOrderApi(wo?._id ?? ""),
				);
				setIsStarting(false);
				if (error) {
					notifyError("Gagal membatalkan perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Dibatalkan", "Perintah kerja telah dibatalkan");
				if (wo?._id) {
					fecthDetailInternalCompanyWorkOrder(wo._id);
				}
			},
		});
	};

	const handleFailWorkOrder = async () => {
		if (!failIssue.trim()) {
			notifyError("Catatan Kendala", "Harap isi alasan kendala");
			return;
		}
		setIsStarting(true);
		const { error } = await handleApi(() =>
			failWorkOrderApi(wo?._id ?? "", { issue: failIssue }),
		);
		setIsStarting(false);
		if (error) {
			notifyError("Gagal", error.message);
			return;
		}
		notifySuccess("Berhasil Digagalkan", "Perintah kerja telah digagalkan");
		setIsFailDialogOpen(false);
		setFailIssue("");
		if (wo?._id) {
			fecthDetailInternalCompanyWorkOrder(wo._id);
		}
	};

	// WorkOrderDetailResponse = ApiResponse<WorkOrderDetail & { meta: WorkOrderMeta }>
	// so detailData.data is WorkOrderDetail & { meta: WorkOrderMeta }
	const wo = detailData as
		| (WorkOrderDetail & { meta?: WorkOrderMeta })
		| undefined;
	const meta =
		wo?.meta ?? (detailData as unknown as { meta?: WorkOrderMeta })?.meta;
	const currentStatus = wo?.status;
	const canStart = meta?.workOrderCapabilities.can_start;
	const canComplete = meta?.workOrderCapabilities.can_complete;
	const canFail = meta?.workOrderCapabilities.can_fail;

	const getHeaderSubtitle = () => {
		if (!wo) return <TextLoading variant="skeleton" />;
		switch (currentStatus) {
			case "draft":
				return "Lakukan konfigurasi sebelum memulai perintah kerja.";
			case "sent":
				return "Menunggu persetujuan perintah kerja.";
			case "approved":
				return "Perintah kerja telah disetujui dan siap dimulai.";
			case "unprocessable":
				return "Perintah kerja belum dapat dikerjakan saat ini.";
			case "onprogress":
				return "Perintah kerja sedang dikerjakan.";
			case "failed":
				return "Perintah kerja mengalami kegagalan.";
			case "completed":
				return "Perintah kerja telah selesai.";
			default:
				return "Detail perintah kerja.";
		}
	};

	return (
		<div className="space-y-6">
			{/* ── Sticky Header ── */}
			<PageHeader
				title="Detail Perintah Kerja"
				subtitle={getHeaderSubtitle()}
				backPath={true}
				className={`sticky top-0 z-30 transition-shadow duration-300 ${isSticky ? "shadow-md rounded-b-md px-4 sm:px-6 bg-background" : ""}`}
				actionButtons={
					!isReadOnly && (
						<>
							{(currentStatus === "draft" ||
								currentStatus === "approved" ||
								currentStatus === "rejected" ||
								currentStatus === "sent") && (
								<>
									{/* {(user?.role === "owner_company" ||
										user?.role === "manager_company") && ( */}
									<Button
										className=" bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={handleCancelWorkOrder}>
										<XCircle className="h-4 w-4" />
										{isSubmittingReady ? "Memproses..." : "Batalkan"}
									</Button>
									{/* )} */}
								</>
							)}

							{currentStatus === "draft" && (
								<Button
									className=" bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
									onClick={handleSendWorkOrder}
									disabled={isSubmittingReady}>
									<CheckCircle2 className="h-4 w-4" />
									{isSubmittingReady ? "Memproses..." : "Kirim"}
								</Button>
							)}

							{currentStatus === "sent" && (
								<>
									{(user?.role === "owner_company" ||
										user?.role === "manager_company") && (
										<div className="px-5 bg-amber-100 w-full font-semibold text-sm md:w-auto text-amber-700 border-1 border-amber-200 rounded-xl  h-11 shadow-sm shadow-amber-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
											<Timer className="h-4 w-4 mr-2" />
											Menunggu Persetujuan
										</div>
									)}

									{user?.role === "staff_company" && (
										<>
											<Button
												className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
												onClick={handleApproveWorkOrder}
												disabled={isStarting}>
												<CheckCircle2 className="h-4 w-4" />
												{isStarting ? "Memproses" : "Setujui"}
											</Button>
											<Button
												className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
												onClick={handleRejectWorkOrder}
												disabled={isStarting}>
												<XCircle className="h-4 w-4" />
												{isStarting ? "Memproses" : "Tolak"}
											</Button>
										</>
									)}
								</>
							)}

							{currentStatus === "approved" && (
								<>
									<Button
										className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={handleStartWorkOrder}
										disabled={isStarting || !canStart}>
										<Play className="h-4 w-4" />
										{isStarting ? "Memulai..." : "Mulai Perintah Kerja"}
									</Button>
								</>
							)}

							{/* TODO:Kalau reject auto cancel ato ga  */}
							{currentStatus === "rejected" && (
								<Button
									className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
									onClick={handleStartWorkOrder}>
									<PlusIcon className="h-4 w-4" /> Buat Baru
								</Button>
							)}

							{(currentStatus === "onprogress" ||
								currentStatus === "completed" ||
								currentStatus === "failed") && (
								<>
									<Button
										className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={() => setIsFailDialogOpen(true)}
										disabled={isStarting || !canFail}>
										<XCircle className="h-4 w-4" />
										{isStarting ? "Memproses..." : "Gagal"}
									</Button>
									<Button
										className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={() => setIsCompleteDialogOpen(true)}
										disabled={isStarting || !canComplete}>
										<CircleCheckBig className="h-4 w-4" />
										{isStarting ? "Memproses..." : "Selesaikan"}
									</Button>

									<Button
										onClick={() => navigate(-1)}
										className="bg-white hover:bg-muted/20 w-full md:w-auto text-black rounded-xl  h-11 shadow-sm shadow-white-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
										<Eye className="h-4 w-4" /> Laporan Pengerjaan
									</Button>
								</>
							)}
						</>
					)
				}
			/>

			{/* ── Loading ── */}
			{loading && !wo && (
				<SectionLoading message="Memuat data perintah kerja..." />
			)}

			{/* ── Content ── */}
			{wo && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-6">
					{/* ── Row 2: 3-column grid ── */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{/* Card 1: Info Umum */}
						<div className="border shadow-sm rounded-xl md:col-span-2">
							<div className="space-y-4 p-5">
								{/* ── Row 1: Status Hero Banner ── */}
								<div className="overflow-hidden border-0 ">
									<div className="relative">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  border-b border-border/50 pb-4">
											<div className="flex items-center gap-4">
												<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
													<FileText className="w-6 h-6" />
												</div>
												<div>
													<h2 className="text-lg font-bold text-foreground leading-tight">
														{wo.service?.title || "—"}
													</h2>
													<p className="text-sm text-muted-foreground mt-0.5">
														{wo.service?.description || "—"}
													</p>
												</div>
											</div>
											<div className="flex flex-wrap items-center gap-2">
												<StatusBadge status={wo.status} />
												{wo.has_issue && (
													<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border text-orange-600 bg-orange-50 border-orange-200">
														<AlertTriangle className="w-3.5 h-3.5" />
														Ada Kendala
													</span>
												)}
											</div>
										</div>

										<div className="grid gird-cols-1 gap-4 lg:grid-cols-2">
											{/* Capabilities Bar */}
											{meta?.workOrderCapabilities && (
												<div className="mt-5 flex flex-col gap-3 pt-4 ">
													<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
														<Settings2 className="w-3.5 h-3.5 mr-1" />
														Keterangan perintah kerja:
													</span>

													<div className="flex flex-col gap-2">
														{/* Alert jika canStart = true (Warna Biru) */}
														{meta.workOrderCapabilities.can_start && (
															<Alert className="max-w-full bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-800">
																<Info className="h-4 w-4" />
																<AlertTitle>Bisa Dimulai</AlertTitle>
																<AlertDescription>
																	Tugas kerja ini bisa mulai dikerjakan
																	sekarang.
																</AlertDescription>
															</Alert>
														)}

														{meta.workOrderCapabilities.can_complete && (
															<Alert className="max-w-full bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-800">
																<CheckCircle2Icon className="h-4 w-4" />
																<AlertTitle>Siap Diselesaikan</AlertTitle>
																<AlertDescription>
																	Tugas kerja ini dapat ditutup.
																</AlertDescription>
															</Alert>
														)}

														{meta.workOrderCapabilities.can_fail && (
															<Alert className="max-w-full bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-800">
																<XCircle className="h-4 w-4" />
																<AlertTitle>Terdapat Masalah</AlertTitle>
																<AlertDescription>
																	Tugas kerja ini dapat digagalkan atau
																	dibatalkan karena suatu kondisi.
																</AlertDescription>
															</Alert>
														)}

														{!meta.workOrderCapabilities.can_start &&
															!meta.workOrderCapabilities.can_complete &&
															!meta.workOrderCapabilities.can_fail && (
																<Alert className="max-w-full bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-yellow-800">
																	<Ban className="h-4 w-4" />
																	<AlertTitle>Menunggu</AlertTitle>
																	<AlertDescription>
																		Menunggu konfirmasi/konfigurasi perintah
																		kerja terkait
																	</AlertDescription>
																</Alert>
															)}
													</div>
												</div>
											)}

											<div className="mt-5 flex flex-col gap-3 pt-4">
												<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
													<Settings2 className="w-3.5 h-3.5 mr-1" />
													Keterangan Kendala :
												</span>
												<div className="flex flex-col gap-2">
													{/* ── Issue note ── */}
													{wo.has_issue && wo.issue_note && (
														<Alert className="max-w-full bg-orange-50 text-orange-800 border-orange-200 [&>svg]:text-orange-800">
															<Info className="h-4 w-4" />
															<AlertTitle>Catatan Kendala</AlertTitle>
															<AlertDescription>
																{wo.issue_note}
															</AlertDescription>
														</Alert>
													)}

													{!wo.has_issue && (
														<Alert className="max-w-full bg-gray-50 text-gray-800 border-gray-200 [&>svg]:text-gray-800">
															<Info className="h-4 w-4" />
															<AlertTitle>Catatan Kendala</AlertTitle>
															<AlertDescription>
																Tidak ada kendala pada perintah kerja ini
															</AlertDescription>
														</Alert>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* informasi lainnya */}
								<div className="grid grid-cols-1 xl:grid-cols-2 ">
									<div className="p-2 space-y-3">
										<InfoRow
											icon={ArrowLeftRight}
											label="Tipe Persetujuan WO"
											value={
												wo.workOrderApprovalAccessType === "auto" ?
													"Otomatis"
												:	"Staff PIC"
											}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={User}
											label="Dibuat Oleh"
											value={
												<div className="flex items-center gap-2">
													<div>
														<p className="text-sm font-medium leading-tight">
															{wo.createdBy?.name || "—"}
														</p>
														<p className="text-xs text-muted-foreground">
															{wo.createdBy?.email || ""}
														</p>
													</div>
												</div>
											}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={Shield}
											label="Disetujui Oleh"
											value={
												wo.approvedBy ?
													<div className="flex items-center gap-2">
														<div>
															<p className="text-sm font-medium leading-tight">
																{wo.approvedBy?.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{wo.approvedBy?.email}
															</p>
														</div>
													</div>
												:	<span className="text-muted-foreground text-sm italic">
														Belum ada
													</span>
											}
										/>
										<div className="border-b border-border/50" />
									</div>
									<div className="p-2 space-y-3">
										<InfoRow
											icon={Calendar}
											label="Tanggal Dibuat"
											value={formatDate(wo.createdAt)}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={Calendar}
											label="Terakhir Diperbarui"
											value={formatDate(wo.updatedAt)}
										/>
									</div>
								</div>
								{/* siblings wo */}
								<div className="mt-5 flex flex-col gap-3 pt-4">
									<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
										<Settings2 className="w-3.5 h-3.5 mr-1" />
										Perintah Kerja Terkait :
									</span>
									<div className="flex flex-col gap-2">
										{meta?.workOrderSiblings &&
											meta.workOrderSiblings.length > 0 && (
												<div className="">
													<div className="space-y-2">
														{meta.workOrderSiblings.map((sibling, index) => (
															<SiblingCard
																key={sibling._id}
																sibling={sibling}
																currentId={wo._id}
																index={index + 1}
															/>
														))}
													</div>
												</div>
											)}
									</div>
								</div>
							</div>
						</div>

						{/* Card 2: Kebutuhan Staff */}
						<StaffAssigned
							wo={wo}
							employees={employees}
							fetchEmployeeList={fetchEmployeeList}
							isReadOnly={isReadOnly}
							currentStatus={currentStatus}
							onAssignSuccess={() =>
								fecthDetailInternalCompanyWorkOrder(wo._id)
							}
						/>
					</div>

					{/* ── Row 3: WO Siblings ── */}

					{/* ── Row 5: Work Order Form Info ── */}
					<WoFormInfo wo={wo} />
				</motion.div>
			)}

			{/* is fail dialog */}
			<Dialog open={isFailDialogOpen} onOpenChange={setIsFailDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Gagalkan Perintah Kerja</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin menggagalkan perintah kerja ini? Silakan
							masukkan catatan kendala atau alasan mengapa gagal.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="issue" className="text-left font-semibold">
								Catatan Kendala <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="issue"
								placeholder="Tulis alasan kendala di sini..."
								value={failIssue}
								onChange={(e) => setFailIssue(e.target.value)}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsFailDialogOpen(false)}
							disabled={isStarting}>
							Batal
						</Button>
						<Button
							variant="destructive"
							onClick={handleFailWorkOrder}
							disabled={isStarting}>
							{isStarting ? "Memproses..." : "Konfirmasi Gagal"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* is complete dialog */}
			<Dialog
				open={isCompleteDialogOpen}
				onOpenChange={setIsCompleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Selesaikan Perintah Kerja</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin menyelesaikan perintah kerja ini? Status
							akan berubah menjadi "Selesai". Anda dapat menambahkan catatan
							opsional jika diperlukan.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label
								htmlFor="complete-issue"
								className="text-left font-semibold">
								Catatan Opsional
							</Label>
							<Textarea
								id="complete-issue"
								placeholder="Tambahkan catatan jika ada..."
								value={completeIssue}
								onChange={(e) => setCompleteIssue(e.target.value)}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCompleteDialogOpen(false)}
							disabled={isStarting}>
							Batal
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700 text-white"
							onClick={handleCompleteWorkOrder}
							disabled={isStarting}>
							{isStarting ? "Memproses..." : "Selesaikan"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

// ─── Small helpers ─────────────────────────────────────────────────────────────

export default CompanyDetailWo;
