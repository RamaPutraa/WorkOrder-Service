import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { EmptyData } from "@/shared/molecules/empty-data";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { useDialogStore } from "@/store/dialogStore";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import {
	getWorkOrderReport,
	sentWorkOrderReportApi,
	submitWorkOrderReportApi,
} from "../services/company-wo-service";
import {
	Calendar,
	Clock,
	XCircle,
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
	const [reportData, setReportData] = useState<WorkReport | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

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
			setLoading(false);

			if (error) {
				setError(error.message);
				notifyError("Gagal memuat laporan", error.message);
				return;
			}
			setReportData(res?.data ?? null);
		};
		void fetchReportData();
	}, [id]);

	// Initialize form data when reportData is loaded
	useEffect(() => {
		if (!reportData) return;

		// TODO: Ketika endpoint API asli sudah jadi, reportForm mungkin berbentuk string (berisi ID form)
		// bukan object utuh. Jika itu terjadi, Anda perlu melakukan GET fetch tambahan memakai ID form
		// untuk mendapatkan object form (berisi title, description, dan fields) sebelum menjabarkan logic di bawah ini.
		const formObj = reportData.reportForm;

		const fieldMap = new Map<number, AnswerValue>();

		const getLatestSubmission = (submissions: SubmissionObject[]) => {
			if (!submissions || submissions.length === 0) return null;
			// Di backend terbaru, formId akan merujuk ke ID dari form. Jika reportForm berbentuk ID, ganti akses ini.
			const relevant = submissions.filter((s) => s.formId === formObj?._id);
			if (relevant.length === 0) return null;
			return relevant.reduce((latest, current) =>
				new Date(current.updatedAt) > new Date(latest.updatedAt) ?
					current
				:	latest,
			);
		};

		const latestSubmission = getLatestSubmission(reportData.submissions || []);

		if (formObj && formObj.fields) {
			formObj.fields.forEach((field) => {
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
	}, [reportData]);

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

				// Cari the latest object to decide if we append or create new.
				const latestSubmission = reportData.submissions?.find(
					(s) => s.formId === reportData.reportForm?._id,
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
					formId: reportData.reportForm._id,
					submissionType: "work_report",
					fieldsData,
					status: "submitted",
					submittedBy: latestSubmission?.submittedBy ?? "",
					createdAt: latestSubmission?.createdAt ?? new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				const { error } = await handleApi(
					() => submitWorkOrderReportApi(id, [submissionToSend]), // API assumes param is (id, submissions array)
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
			case "onprogress":
				return {
					bg: "bg-primary/5",
					text: "text-primary",
					label: "Sedang Dikerjakan",
					icon: Clock,
				};
			case "submitted":
				return {
					bg: "bg-green-100",
					text: "text-green-700",
					label: "Terkirim",
					icon: Clock,
				};
		}
	};

	const handleSendWorkReport = () => {
		if (!reportData || !id) return;

		// Cari the latest object to send
		const latestSubmission = reportData.submissions?.find(
			(s) => s.formId === reportData.reportForm?._id,
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
					sentWorkOrderReportApi(id, latestSubmission),
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

	const statusConfig = reportData ? getStatusConfig(reportData.status) : null;
	const StatusIcon = statusConfig?.icon ?? Clock;

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Laporan Tugas Kerja"
				subtitle="Tinjau dan kelola rincian penyelesaian tugas kerja"
				backPath={true}
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
					{/* ── [OPSI A] Flat horizontal bar dengan divider vertikal ── */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="flex items-center gap-6 sm:gap-10 flex-wrap w-full">
							<div className="space-y-1.5 flex-1 sm:flex-none">
								<p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
									Status Laporan
								</p>
								<div className="flex items-center gap-2">
									<StatusIcon className={`w-4 h-4 ${statusConfig?.text}`} />
									<span className={`text-sm font-bold ${statusConfig?.text}`}>
										{statusConfig?.label}
									</span>
								</div>
							</div>
							<div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
							<div className="space-y-1.5 flex-1 sm:flex-none">
								<p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
									Disetujui Oleh
								</p>
								<div className="flex items-center gap-2">
									<User className="w-4 h-4 text-gray-400" />
									<span
										className={`text-sm font-bold ${reportData.approvedBy ? "text-gray-900" : "text-gray-400"}`}>
										{reportData.approvedBy ?
											reportData.approvedBy.name
										:	"Belum disetujui"}
									</span>
								</div>
							</div>
							<div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
							<div className="space-y-1.5 flex-1 sm:flex-none">
								<p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
									Dibuat Pada
								</p>
								<div className="flex items-center gap-2 text-sm font-bold text-gray-900">
									<Calendar className="w-4 h-4 text-gray-400" />
									{new Date(reportData.createdAt).toLocaleDateString("id-ID", {
										day: "2-digit",
										month: "long",
										year: "numeric",
									})}
								</div>
							</div>
						</div>
					</div>

					{/* Form Editor Card */}
					<Card className="border shadow-sm rounded-xl">
						<CardHeader className="pb-4 border-b border-border/50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
										<Settings2 className="w-5 h-5" />
									</div>
									<div>
										<h2 className="text-md font-bold text-foreground leading-tight">
											{reportData.reportForm?.title || "Formulir Laporan"}
										</h2>
										<p className="text-sm text-muted-foreground mt-0.5">
											{reportData.reportForm?.description ||
												"Isi rincian hasil pekerjaan di lapangan."}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{!isEditMode && (
										<Button
											onClick={() => setIsEditMode(true)}
											className="bg-yellow-400 hover:bg-yellow-500 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-yellow-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
											<Pencil className="w-4 h-4 mr-2" />
											Edit Laporan
										</Button>
									)}
									<Button
										onClick={handleSendWorkReport}
										className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
										<Send className="w-4 h-4 mr-2" />
										Kirim Laporan
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 pt-6">
							{!reportData.reportForm ?
								<EmptyData />
							:	<div className="space-y-4">
									{reportData.reportForm.fields?.length > 0 ?
										reportData.reportForm.fields
											.sort((a, b) => a.order - b.order)
											.map((field, idx) => {
												const answer = formData.get(field.order) ?? null;
												return (
													<div key={field.order}>
														<FormFieldViewer
															field={field}
															answer={answer}
															index={idx + 1}
															readOnly={!isEditMode}
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

							{isEditMode && hasChanges() && (
								<div className="flex items-center justify-end border-t mt-6 pt-5 gap-3">
									<Button
										className="bg-white border hover:bg-muted/20 w-full md:w-auto text-black rounded-xl h-11 shadow-sm transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={handleCancel}
										disabled={isSaving}>
										<X className="w-4 h-4 mr-2" />
										Batal
									</Button>
									<Button
										className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
										onClick={handleSave}
										disabled={isSaving}>
										<Save className="w-4 h-4 mr-2" />
										{isSaving ? "Menyimpan..." : "Simpan Laporan"}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

export default CompanyReportWo;
