import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWoDetailSync } from "./use-wo-detail-sync";
import { useEmployeeList } from "./use-employee-list";
import {
	approveWorkOrderApi,
	cancelWorkOrderApi,
	completeWorkOrderApi,
	failWorkOrderApi,
	recreateRejectedWorkOrderApi,
	rejectWorkOrderApi,
	sendWorkOrderApi,
	startWorkOrderApi,
} from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useDialogStore } from "@/store/dialogStore";
import { useAuthStore } from "@/store/authStore";

export const useCompanyDetailWo = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	// ─── Data WO dari cache Zustand + Window Focus Refetch ───────────────────────
	const {
		woDetail,
		reportData,
		isLoading: isWoLoading,
		isReportFetching,
		isBackgroundRefreshing,
		refreshBackground,
		refreshReport,
		forceRefetch,
	} = useWoDetailSync(id);

	// ─── Employee list ───────────────────────────────────────────────────────────
	const { employees, fetchEmployeeList } = useEmployeeList();

	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();

	const isReadOnly = user?.role === "staff_company";

	const [isSticky, setIsSticky] = useState(false);
	const [activeAction, setActiveAction] = useState<string | null>(null);
	const [isCardRefreshing, setIsCardRefreshing] = useState(false);
	const [isFailDialogOpen, setIsFailDialogOpen] = useState(false);
	const [failIssue, setFailIssue] = useState("");
	const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
	const [completeIssue, setCompleteIssue] = useState("");

	// ─── Scroll → Sticky Header ──────────────────────────────────────────────────
	useEffect(() => {
		const handleScroll = () => setIsSticky(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// ─── Fetch Work Report saat status WO berubah ke status reportable ───────────
	useEffect(() => {
		// Tunggu sampai data WO tersedia
		if (isWoLoading || isBackgroundRefreshing || !woDetail) {
			return;
		}

		const reportableStatuses = ["on_progress", "completed", "failed"];
		if (!reportableStatuses.includes(woDetail.status ?? "")) {
			return;
		}

		// Fetch report and save to cache
		void refreshReport(false);
	}, [woDetail, isWoLoading, isBackgroundRefreshing]);

	// ─── Parsing Data WO ─────────────────────────────────────────────────────────
	const wo = woDetail as
		| (WorkOrderDetail & { meta?: WorkOrderMeta })
		| undefined;
	const meta = wo?.meta;
	const workReport = reportData;
	const currentStatus = wo?.status;
	const canStart = meta?.workOrderCapabilities.can_start;
	const canComplete = meta?.workOrderCapabilities.can_complete;
	const canFail = meta?.workOrderCapabilities.can_fail;
	const userPic = wo?.staffPIC?.email === user?.email;

	const userCreated: boolean | null =
		wo?.createdBy == null ? null
		: wo.createdBy.email === user?.email ? true
		: false;
	const userAssigned = wo?.assignedStaff?.some((s) => s.email === user?.email);
	const isDrafted = currentStatus === "drafted";
	const canCancel = meta?.workOrderCapabilities.can_cancel;

	const isOwnerOrAllowedManager =
		user?.role === "owner_company" ||
		(user?.role === "manager_company" &&
			(userCreated === true || userCreated === null));
	const canRecreateEdit =
		!!meta?.workOrderCapabilities?.can_recreate && isOwnerOrAllowedManager;

	// ─── Action Handlers ─────────────────────────────────────────────────────────
	// Semua action yang mengubah status/meta menggunakan refreshBackground()
	// karena server perlu menghitung ulang meta.workOrderCapabilities.

	const handleSendWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Konfigurasi Selesai",
			description:
				"Apakah Anda yakin konfigurasi sudah selesai dan siap untuk memulai perintah kerja?",
			confirmText: "Ya, Selesai",
			cancelText: "Batal",
			onConfirm: async () => {
				setActiveAction("send");
				const { error } = await handleApi(() =>
					sendWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal menandai konfigurasi selesai", error.message);
					return;
				}
				notifySuccess("Konfigurasi Selesai", "Work order siap untuk dimulai");
				refreshBackground();
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
				setActiveAction("start");
				const { error } = await handleApi(() =>
					startWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal memulai perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Dimulai", "Perintah kerja telah dimulai");
				refreshBackground();
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
				setActiveAction("approve");
				const { error } = await handleApi(() =>
					approveWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal menyetujui perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Disetujui", "Perintah kerja telah disetujui");
				refreshBackground();
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
				setActiveAction("reject");
				const { error } = await handleApi(() =>
					rejectWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal menolak perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Ditolak", "Perintah kerja telah ditolak");
				refreshBackground();
			},
		});
	};

	const handleCompleteWorkOrder = async () => {
		setActiveAction("complete");
		const { error } = await handleApi(() =>
			completeWorkOrderApi(wo?._id ?? "", { issue: completeIssue }),
		);
		setActiveAction(null);
		if (error) {
			notifyError("Gagal menyelesaikan perintah kerja", error.message);
			return;
		}
		notifySuccess("Berhasil Selesai", "Perintah kerja telah selesai");
		setIsCompleteDialogOpen(false);
		setCompleteIssue("");
		refreshBackground();
	};

	const handleCancelWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Pembatalan",
			description:
				"Apakah Anda yakin ingin membatalkan perintah kerja ini? Status akan berubah menjadi 'Dibatalkan'.",
			confirmText: "Ya, Batalkan",
			cancelText: "Batal",
			onConfirm: async () => {
				setActiveAction("cancel");
				const { error } = await handleApi(() =>
					cancelWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal membatalkan perintah kerja", error.message);
					return;
				}
				notifySuccess("Berhasil Dibatalkan", "Perintah kerja telah dibatalkan");
				// Clear cache agar next visit selalu dapat data segar
				forceRefetch();
			},
		});
	};

	const handleFailWorkOrder = async () => {
		if (!failIssue.trim()) {
			notifyError("Catatan Kendala", "Harap isi alasan kendala");
			return;
		}
		setActiveAction("fail");
		const { error } = await handleApi(() =>
			failWorkOrderApi(wo?._id ?? "", { issue: failIssue }),
		);
		setActiveAction(null);
		if (error) {
			notifyError("Gagal", error.message);
			return;
		}
		notifySuccess("Berhasil Digagalkan", "Perintah kerja telah digagalkan");
		setIsFailDialogOpen(false);
		setFailIssue("");
		refreshBackground();
	};

	const handleRecreateWorkOrder = () => {
		showDialog({
			title: "Konfirmasi Pembuatan Ulang",
			description:
				"Apakah Anda yakin ingin membuat ulang perintah kerja ini? Status akan berubah menjadi 'Dibuat'.",
			confirmText: "Ya, Buat Ulang",
			cancelText: "Batal",
			onConfirm: async () => {
				setActiveAction("recreate");
				const { error } = await handleApi(() =>
					recreateRejectedWorkOrderApi(wo?._id ?? ""),
				);
				setActiveAction(null);
				if (error) {
					notifyError("Gagal membuat ulang perintah kerja", error.message);
					return;
				}
				notifySuccess(
					"Berhasil Dibuat Ulang",
					"Perintah kerja telah dibuat ulang",
				);
				// Clear cache agar halaman detail menampilkan data segar
				forceRefetch();
				navigate(-1);
			},
		});
	};

	const getHeaderSubtitle = () => {
		if (!wo) return null;
		switch (currentStatus) {
			case "drafted":
				return "Lakukan konfigurasi sebelum memulai perintah kerja.";
			case "sent":
				return "Menunggu persetujuan perintah kerja.";
			case "approved":
				return "Perintah kerja telah disetujui dan siap dimulai.";
			case "unprocessable":
				return "Perintah kerja belum dapat dikerjakan saat ini.";
			case "on_progress":
				return "Perintah kerja sedang dikerjakan.";
			case "failed":
				return "Perintah kerja mengalami kegagalan.";
			case "completed":
				return "Perintah kerja telah selesai.";
			default:
				return "Detail perintah kerja.";
		}
	};

	// isPageLoading: true hanya saat initial load WO (tidak ada data di cache sama sekali).
	// isReportFetching dikelola terpisah agar tidak memblokir tampilan data WO utama.
	const isPageLoading = isWoLoading;

	return {
		navigate,
		user,
		isReadOnly,
		isSticky,
		activeAction,
		isFailDialogOpen,
		setIsFailDialogOpen,
		failIssue,
		setFailIssue,
		isCompleteDialogOpen,
		setIsCompleteDialogOpen,
		completeIssue,
		setCompleteIssue,
		workReport,
		isReportFetching,
		wo,
		meta,
		currentStatus,
		canStart,
		canComplete,
		canFail,
		userPic,
		userCreated,
		userAssigned,
		isDrafted,
		canCancel,
		canRecreateEdit,
		getHeaderSubtitle,
		isPageLoading,
		isBackgroundRefreshing,
		handleSendWorkOrder,
		handleStartWorkOrder,
		handleApproveWorkOrder,
		handleRejectWorkOrder,
		handleCompleteWorkOrder,
		handleCancelWorkOrder,
		handleFailWorkOrder,
		handleRecreateWorkOrder,
		employees,
		fetchEmployeeList,
		refreshBackground,
		isCardRefreshing,
		setIsCardRefreshing,
	};
};
