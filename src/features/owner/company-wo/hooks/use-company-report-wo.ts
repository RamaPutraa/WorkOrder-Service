import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDialogStore } from "@/store/dialogStore";
import { useAuthStore } from "@/store/authStore";
import { useWoDetailSync } from "./use-wo-detail-sync";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import {
	getWorkOrderReport,
	sentWorkOrderReportApi,
	submitWorkOrderReportApi,
	approvedWorkOrderReportApi,
	rejectWorkOrderReportApi,
} from "../services/company-wo-service";
import { uploadFileApi } from "@/lib/file-service";
import type { AnswerValue } from "@/shared/molecules/form-field-viewer";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const useCompanyReportWo = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();
	const {
		woDetail: detailData,
		reportData: cachedReport,
		formObject: cachedForm,
		isReportFetching: isReportLoading,
		isFormFetching,
		refreshReport,
		refreshFormObject,
		updateReport,
		refreshBackground: refreshWoCache,
	} = useWoDetailSync(id);

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
		if (!id) return;
		setError(null);
		void refreshReport(false);
	}, [id]);

	// Fetch Form Object when report data is available
	useEffect(() => {
		if (cachedReport?.reportForm) {
			const formIdToFetch =
				typeof cachedReport.reportForm === "string" ?
					cachedReport.reportForm
				:	(cachedReport.reportForm as any)._id;

			void refreshFormObject(formIdToFetch);
		}
	}, [cachedReport?.reportForm]);

	// Initialize form data when cachedReport and cachedForm are loaded
	useEffect(() => {
		if (!cachedReport || !cachedForm) return;

		const fieldMap = new Map<number, AnswerValue>();

		const getLatestSubmission = (submissions: SubmissionObject[]) => {
			if (!submissions || submissions.length === 0) return null;
			const relevant = submissions.filter((s) => s.formId === cachedForm._id);
			if (relevant.length === 0) return null;
			return relevant.reduce((latest, current) =>
				new Date(current.updatedAt) > new Date(latest.updatedAt) ?
					current
				:	latest,
			);
		};

		const latestSubmission = getLatestSubmission(
			cachedReport.submissions || [],
		);

		if (cachedForm && cachedForm.fields) {
			cachedForm.fields.forEach((field) => {
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

		setOriginalFormData(new Map(fieldMap));
		setFormData(fieldMap);

		// Auto masuk mode edit jika belum pernah diisi (submissions kosong)
		if (!latestSubmission) {
			setIsEditMode(true);
		}
	}, [cachedReport, cachedForm, id, canEdit]);

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
		if (!cachedReport || !id) return;
		showDialog({
			title: "Konfirmasi Simpan",
			description:
				"Apakah Anda yakin ingin menyimpan perubahan laporan kerja ini?",
			confirmText: "Simpan",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSaving(true);

				const formIdToSave =
					typeof cachedReport.reportForm === "string" ?
						cachedReport.reportForm
					:	(cachedReport.reportForm as any)._id;

				const latestSubmission = cachedReport.submissions?.find(
					(s) => s.formId === formIdToSave,
				);

				// 1. Upload pending files first
				for (const [order, value] of formData.entries()) {
					if (value instanceof File) {
						const { error, data } = await handleApi(() => uploadFileApi(value));
						if (error || !data) {
							setIsSaving(false);
							notifyError(
								"Gagal menyimpan",
								"Gagal mengunggah gambar. Silakan coba lagi.",
							);
							return;
						}
						// Replace File object with URL string in formData
						formData.set(order, data.data.url);
					}
				}

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
					submitWorkOrderReportApi(cachedReport._id, submissionToSend),
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

				const { data: res } = await handleApi(() => getWorkOrderReport(id));
				if (res?.data) {
					updateReport(res.data);
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
					bg: "bg-yellow-100",
					text: "text-yellow-700",
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

	const checkUnsavedForm = () => {
		if (hasChanges()) {
			notifyError(
				"Perubahan Belum Disimpan",
				"Mohon simpan laporan kerja terlebih dahulu sebelum melanjutkan.",
			);
			return true;
		}
		return false;
	};

	const handleSendWorkReport = () => {
		if (!cachedReport || !id) return;
		if (checkUnsavedForm()) return;

		const formIdToSend =
			typeof cachedReport.reportForm === "string" ?
				cachedReport.reportForm
			:	(cachedReport.reportForm as any)._id;

		const latestSubmission = cachedReport.submissions?.find(
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
					sentWorkOrderReportApi(cachedReport._id, latestSubmission),
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

				// Update cache WO detail agar status alert di halaman detail ikut berubah
				refreshWoCache();

				const { data: res } = await handleApi(() => getWorkOrderReport(id));
				if (res?.data) {
					updateReport(res.data);
				}
			},
		});
	};

	const handleApproveReport = () => {
		if (!cachedReport) return;
		if (checkUnsavedForm()) return;
		showDialog({
			title: "Konfirmasi Persetujuan Laporan",
			description:
				"Apakah Anda yakin ingin menyetujui laporan kerja ini? Tindakan ini tidak dapat dibatalkan.",
			confirmText: "Ya, Setujui",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsProcessing(true);
				const { error } = await handleApi(() =>
					approvedWorkOrderReportApi(cachedReport._id),
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
				// Update cache WO detail agar status alert di halaman detail ikut berubah
				refreshWoCache();
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) updateReport(res.data);
				}
			},
		});
	};

	const handleRejectReport = () => {
		if (!cachedReport) return;
		if (checkUnsavedForm()) return;
		showDialog({
			title: "Konfirmasi Penolakan Laporan",
			description:
				"Apakah Anda yakin ingin menolak laporan kerja ini? Tindakan ini tidak dapat dibatalkan.",
			confirmText: "Ya, Tolak",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsProcessing(true);
				const { error } = await handleApi(() =>
					rejectWorkOrderReportApi(cachedReport._id),
				);
				setIsProcessing(false);
				if (error) {
					notifyError("Gagal menolak laporan", error.message);
					return;
				}
				notifySuccess("Laporan Ditolak", "Laporan tugas kerja telah ditolak.");
				// Update cache WO detail agar status alert di halaman detail ikut berubah
				refreshWoCache();
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) updateReport(res.data);
				}
			},
		});
	};

	return {
		navigate,
		reportData: cachedReport,
		formObject: cachedForm,
		loading: isReportLoading || isFormFetching,
		error,
		isSaving,
		isProcessing,
		isEditMode,
		setIsEditMode,
		formData,
		isReviewer,
		canEdit,
		canSendReport,
		handleFieldChange,
		hasChanges,
		handleSave,
		handleCancel,
		handleSendWorkReport,
		handleApproveReport,
		handleRejectReport,
		getStatusConfig,
	};
};
