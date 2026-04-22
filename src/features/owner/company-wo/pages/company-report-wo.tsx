import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { EmptyData } from "@/shared/molecules/empty-data";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { useDialogStore } from "@/store/dialogStore";
import { useAuthStore } from "@/store/authStore";
import { useCompanyWo } from "../hooks/use-company-wo";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import {
	getWorkOrderReport,
	sentWorkOrderReportApi,
	submitWorkOrderReportApi,
	approvedWorkOrderReportApi,
	rejectWorkOrderReportApi,
} from "../services/company-wo-service";
import { getFormByIdApi } from "@/features/owner/form/services/formService";
import {
	Calendar,
	Clock,
	XCircle,
	CheckCircle2,
	Pencil,
	Save,
	X,
	Settings2,
	Send,
	User,
} from "lucide-react";

const CompanyReportWo = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();
	const { detailData } = useCompanyWo();
	const [reportData, setReportData] = useState<WorkReport | null>(null);
	const [formObject, setFormObject] = useState<Form | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// Role-based permissions
	const isReviewer =
		user?.role === "owner_company" || user?.role === "manager_company";
	const canEdit = !isReviewer; // only staff can edit/submit report

	const isAssignedStaff =
		detailData?.assignedStaff?.some((s) => s.email === user?.email) || false;
	const isPic = detailData?.staffPIC?.email === user?.email || false;
	const canSendReport = isAssignedStaff || isPic;

	// State for form data tracking
	const [formData, setFormData] = useState<Map<number, AnswerValue>>(new Map());
	const [originalFormData, setOriginalFormData] = useState<
		Map<number, AnswerValue>
	>(new Map());

	// Fetch Report Data
	useEffect(() => {
		const fetchReportData = async () => {
			if (!id) return;
			setLoading(true);
			setError(null);
			const { data: res, error } = await handleApi(() =>
				getWorkOrderReport(id),
			);

			if (error) {
				setLoading(false);
				setError(error.message);
				notifyError("Gagal memuat laporan", error.message);
				return;
			}

			const newReportData = res?.data ?? null;
			setReportData(newReportData);

			if (newReportData?.reportForm) {
				const formIdToFetch =
					typeof newReportData.reportForm === "string" ?
						newReportData.reportForm
					:	(newReportData.reportForm as any)._id;

				const { data: formRes, error: formError } = await handleApi(() =>
					getFormByIdApi(formIdToFetch),
				);

				if (formError) {
					notifyError("Gagal memuat formulir", formError.message);
				} else {
					setFormObject(formRes?.data ?? null);
				}
			}

			setLoading(false);
		};
		void fetchReportData();
	}, [id]);

	// Initialize form data when reportData and formObject are loaded
	useEffect(() => {
		if (!reportData || !formObject) return;

		const fieldMap = new Map<number, AnswerValue>();

		const getLatestSubmission = (submissions: SubmissionObject[]) => {
			if (!submissions || submissions.length === 0) return null;
			const relevant = submissions.filter((s) => s.formId === formObject._id);
			if (relevant.length === 0) return null;
			return relevant.reduce((latest, current) =>
				new Date(current.updatedAt) > new Date(latest.updatedAt) ?
					current
				:	latest,
			);
		};

		const latestSubmission = getLatestSubmission(reportData.submissions || []);

		if (formObject && formObject.fields) {
			formObject.fields.forEach((field) => {
				let answer: AnswerValue = null;
				if (latestSubmission) {
					const submittedData = latestSubmission.fieldsData.find(
						(fd) => fd.order === field.order,
					);
					answer = submittedData?.value ?? null;
				}
				fieldMap.set(field.order, answer);
			});
		}

		setFormData(fieldMap);
		setOriginalFormData(new Map(fieldMap));

		// Auto masuk mode edit jika belum pernah diisi (submissions kosong)
		if (!latestSubmission) {
			setIsEditMode(true);
		}
	}, [reportData, formObject]);

	// Listen to field changes
	const handleFieldChange = (order: number, value: AnswerValue) => {
		setFormData((prev) => {
			const newData = new Map(prev);
			newData.set(order, value);
			return newData;
		});
	};

	// Detect changes
	const hasChanges = () => {
		if (formData.size !== originalFormData.size) return true;
		for (const [order, value] of formData.entries()) {
			const originalValue = originalFormData.get(order);
			if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
				return true;
			}
		}
		return false;
	};

	// Save Function
	const handleSave = () => {
		if (!reportData || !id) return;
		showDialog({
			title: "Konfirmasi Simpan",
			description:
				"Apakah Anda yakin ingin menyimpan perubahan laporan kerja ini?",
			confirmText: "Simpan",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSaving(true);

				const formIdToSave =
					typeof reportData.reportForm === "string" ?
						reportData.reportForm
					:	(reportData.reportForm as any)._id;

				// Cari the latest object to decide if we append or create new.
				const latestSubmission = reportData.submissions?.find(
					(s) => s.formId === formIdToSave,
				);

				const fieldsData = Array.from(formData.entries()).map(
					([order, value]) => ({
						order: order,
						value: value ?? "",
					}),
				);

				const submissionToSend: SubmissionObject = {
					_id:
						latestSubmission?._id ??
						`sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
					ownerId: latestSubmission?.ownerId ?? "",
					formId: formIdToSave,
					submissionType: "work_report",
					fieldsData,
					status: "submitted",
					submittedBy: latestSubmission?.submittedBy ?? "",
					createdAt: latestSubmission?.createdAt ?? new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				const { error } = await handleApi(() =>
					submitWorkOrderReportApi(reportData._id, submissionToSend),
				);

				setIsSaving(false);

				if (error) {
					notifyError("Gagal menyimpan", error.message);
					return;
				}
				notifySuccess(
					"Berhasil disimpan",
					"Laporan tugas kerja telah diperbarui",
				);
				setIsEditMode(false);

				// Optional: re-fetch or optimistically update
				const { data: res } = await handleApi(() => getWorkOrderReport(id));
				if (res?.data) {
					setReportData(res.data);
				}
			},
		});
	};

	const handleCancel = () => {
		showDialog({
			title: "Konfirmasi Batal",
			description:
				"Batal mengubah laporan? Perubahan yang belum tersimpan akan memudar.",
			confirmText: "Ya, Batal",
			cancelText: "Tidak",
			onConfirm: () => {
				setFormData(new Map(originalFormData));
				setIsEditMode(false);
			},
		});
	};

	const getStatusConfig = (status: string) => {
		switch (status.toLowerCase()) {
			case "on_progress":
				return {
					bg: "bg-gray-100",
					text: "text-gray-700",
					label: "Sedang Dikerjakan",
					icon: Clock,
				};
			case "submitted":
				return {
					bg: "bg-primary/5",
					text: "text-primary",
					label: "Terkirim",
					icon: Clock,
				};
			case "approved":
				return {
					bg: "bg-green-100",
					text: "text-green-700",
					label: "Disetujui",
					icon: CheckCircle2,
				};
			case "rejected":
				return {
					bg: "bg-red-100",
					text: "text-red-700",
					label: "Ditolak",
					icon: XCircle,
				};
		}
	};

	const handleSendWorkReport = () => {
		if (!reportData || !id) return;

		const formIdToSend =
			typeof reportData.reportForm === "string" ?
				reportData.reportForm
			:	(reportData.reportForm as any)._id;

		// Cari the latest object to send
		const latestSubmission = reportData.submissions?.find(
			(s) => s.formId === formIdToSend,
		);

		if (!latestSubmission) {
			notifyError(
				"Laporan Kosong",
				"Pastikan Anda menyimpan draf laporan terlebih dahulu sebelum mencoba mengirimnya.",
			);
			return;
		}

		showDialog({
			title: "Konfirmasi Kirim Laporan",
			description:
				"Apakah Anda yakin ingin mengirim laporan? Laporan yang sudah dikirim tidak dapat diubah.",
			confirmText: "Ya, Kirim",
			cancelText: "Tidak",
			onConfirm: async () => {
				setIsSaving(true);
				const { error } = await handleApi(() =>
					sentWorkOrderReportApi(reportData._id, latestSubmission),
				);

				setIsSaving(false);

				if (error) {
					notifyError("Gagal mengirim", error.message);
					return;
				}

				notifySuccess(
					"Berhasil dikirim",
					"Laporan tugas kerja telah terkirim ke sistem.",
				);

				setIsEditMode(false);

				// Re-fetch or optimistically update
				const { data: res } = await handleApi(() => getWorkOrderReport(id));
				if (res?.data) {
					setReportData(res.data);
				}
			},
		});
	};

	// Approve report handler
	const handleApproveReport = () => {
		if (!reportData) return;
		showDialog({
			title: "Konfirmasi Persetujuan Laporan",
			description:
				"Apakah Anda yakin ingin menyetujui laporan kerja ini? Tindakan ini tidak dapat dibatalkan.",
			confirmText: "Ya, Setujui",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsProcessing(true);
				const { error } = await handleApi(() =>
					approvedWorkOrderReportApi(reportData._id),
				);
				setIsProcessing(false);
				if (error) {
					notifyError("Gagal menyetujui laporan", error.message);
					return;
				}
				notifySuccess(
					"Laporan Disetujui",
					"Laporan tugas kerja telah berhasil disetujui.",
				);
				// Re-fetch
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) setReportData(res.data);
				}
			},
		});
	};

	// Reject report handler
	const handleRejectReport = () => {
		if (!reportData) return;
		showDialog({
			title: "Konfirmasi Penolakan Laporan",
			description:
				"Apakah Anda yakin ingin menolak laporan kerja ini? Tindakan ini tidak dapat dibatalkan.",
			confirmText: "Ya, Tolak",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsProcessing(true);
				const { error } = await handleApi(() =>
					rejectWorkOrderReportApi(reportData._id),
				);
				setIsProcessing(false);
				if (error) {
					notifyError("Gagal menolak laporan", error.message);
					return;
				}
				notifySuccess("Laporan Ditolak", "Laporan tugas kerja telah ditolak.");
				// Re-fetch
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) setReportData(res.data);
				}
			},
		});
	};

	const statusConfig = reportData ? getStatusConfig(reportData.status) : null;
	const StatusIcon = statusConfig?.icon ?? Clock;
	// const workReportStatus = reportData?.status === "on_progress";

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Laporan Tugas Kerja"
				subtitle="Tinjau dan kelola rincian penyelesaian tugas kerja"
				backPath={true}
				addIcon={<Send className="h-4 w-4" />}
				// addLabel="Kirim Laporan"
				// onAddClick={handleSendWorkReport}
				loading={isSaving}
				actionButtons={
					<Button
						className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
						onClick={handleSendWorkReport}
						disabled={isSaving || !canSendReport}>
						<Send className="h-4 w-4" />
						{isSaving ? "Memproses..." : "Finalisasi Laporan"}
					</Button>
				}
			/>

			{loading && <SectionLoading message="Memuat laporan..." />}

			{error && !loading && (
				<Card className="p-8 border-red-200 bg-red-50">
					<div className="flex flex-col items-center gap-3 text-center">
						<XCircle className="w-12 h-12 text-red-500" />
						<div>
							<h3 className="font-semibold text-red-900">
								Gagal Memuat Laporan
							</h3>
							<p className="text-sm text-red-700 mt-1">{error}</p>
						</div>
						<Button onClick={() => navigate(-1)} variant="outline" size="sm">
							Kembali
						</Button>
					</div>
				</Card>
			)}

			{!loading && !error && reportData && (
				<div className="space-y-6">
					{/* ── Status Bar ── */}
					<div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
							{/* Status Laporan */}
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<StatusIcon className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Status Laporan
									</p>
									<span className={`text-sm font-bold ${statusConfig?.text}`}>
										{statusConfig?.label}
									</span>
								</div>
							</div>

							{/* Disetujui Oleh */}
							<div className="flex items-center gap-3 sm:border-l sm:pl-6 lg:border-l-0 lg:pl-0 xl:border-l xl:pl-6 border-gray-100">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<User className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Disetujui Oleh
									</p>
									<span
										className={`text-sm font-bold truncate block ${reportData.approvedBy ? "text-gray-900" : "text-gray-400"}`}>
										{reportData.approvedBy ?
											reportData.approvedBy.name
										: reportData.workReportApprovalAccessType === "auto" ?
											"Disetujui Otomatis"
										:	"Belum disetujui"}
									</span>
								</div>
							</div>

							{/* Dibuat Pada */}
							<div className="flex items-center gap-3 lg:border-l lg:pl-6 xl:border-l xl:pl-6 border-gray-100">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<Calendar className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Dibuat Pada
									</p>
									<div className="text-sm font-bold text-gray-900">
										{new Date(reportData.createdAt).toLocaleDateString(
											"id-ID",
											{
												day: "2-digit",
												month: "long",
												year: "numeric",
											},
										)}
									</div>
								</div>
							</div>

							{/* Approve / Reject buttons — hanya untuk reviewer & laporan sudah terkirim */}
							{isReviewer && reportData.status === "submitted" && (
								<div className="flex items-center gap-2 xl:border-l xl:pl-6 border-gray-100 sm:col-span-2 lg:col-span-3 xl:col-span-1">
									<Button
										onClick={handleRejectReport}
										disabled={isProcessing}
										className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-4 shadow-sm shadow-red-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer text-sm">
										<XCircle className="w-4 h-4" />
										{isProcessing ? "..." : "Tolak"}
									</Button>
									<Button
										onClick={handleApproveReport}
										disabled={isProcessing}
										className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white rounded-xl h-10 px-4 shadow-sm shadow-green-200 transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer text-sm">
										<CheckCircle2 className="w-4 h-4" />
										{isProcessing ? "..." : "Setujui"}
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Form Editor Card */}
					<Card className="border shadow-sm rounded-xl">
						<CardHeader className="pb-4 border-b border-border/50">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
										<Settings2 className="w-5 h-5" />
									</div>
									<div>
										<h2 className="text-md font-bold text-foreground leading-tight">
											{formObject?.title || "Formulir Laporan"}
										</h2>
										<p className="text-sm text-muted-foreground mt-0.5">
											{formObject?.description ||
												"Isi rincian hasil pekerjaan di lapangan."}
										</p>
									</div>
								</div>

								{/* Edit & Kirim hanya untuk staff (bukan manager/owner) */}
								{canEdit && (
									<div className="flex items-center gap-2 self-end sm:self-auto">
										<div className="border-r border-slate-200 pr-2">
											<Button
												onClick={() => setIsEditMode(true)}
												disabled={isEditMode}
												className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl h-9 px-3 text-sm shadow-sm transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
												title="Edit Laporan">
												<Pencil className="w-4 h-4" />
											</Button>
										</div>

										<div className="flex items-center gap-2">
											<Button
												onClick={handleCancel}
												disabled={isSaving || !isEditMode}
												className="bg-white border hover:bg-muted/20 text-black rounded-xl h-9 px-3 text-sm shadow-sm transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
												<X className="w-4 h-4 sm:mr-1.5" />
												<span className="hidden sm:inline">Batal</span>
											</Button>
											<Button
												onClick={handleSave}
												disabled={isSaving || !isEditMode || !hasChanges()}
												className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-3 text-sm shadow-sm transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
												<Save className="w-4 h-4 sm:mr-1.5" />
												<span className="hidden sm:inline">
													{isSaving ? "Simpan..." : "Simpan Laporan"}
												</span>
												<span className="sm:hidden">
													{isSaving ? "..." : "Simpan"}
												</span>
											</Button>
										</div>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4 pt-6">
							{!formObject ?
								<EmptyData />
							:	<div className="space-y-4">
									{formObject.fields && formObject.fields.length > 0 ?
										[...formObject.fields]
											.sort((a, b) => a.order - b.order)
											.map((field, idx) => {
												const answer = formData.get(field.order) ?? null;
												return (
													<div key={field.order}>
														<FormFieldViewer
															field={field}
															answer={answer}
															index={idx + 1}
															readOnly={!isEditMode || isReviewer}
															onChange={(value) =>
																handleFieldChange(field.order, value)
															}
														/>
													</div>
												);
											})
									:	<EmptyData />}
								</div>
							}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default CompanyReportWo;
