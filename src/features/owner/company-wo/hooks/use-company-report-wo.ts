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
import { getFormByIdApi } from "@/features/owner/form/services/formService";
import type { AnswerValue } from "@/shared/molecules/form-field-viewer";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const useCompanyReportWo = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();
	const { woDetail: detailData } = useWoDetailSync(id);

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

				const { data: res } = await handleApi(() => getWorkOrderReport(id));
				if (res?.data) {
					setReportData(res.data);
				}
			},
		});
	};

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
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) setReportData(res.data);
				}
			},
		});
	};

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
				if (id) {
					const { data: res } = await handleApi(() => getWorkOrderReport(id));
					if (res?.data) setReportData(res.data);
				}
			},
		});
	};

	return {
		navigate,
		reportData,
		formObject,
		loading,
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
