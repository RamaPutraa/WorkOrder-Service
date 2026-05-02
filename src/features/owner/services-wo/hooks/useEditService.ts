import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

// API services
import { getPositionsApi } from "@/features/owner/position/services/positionService";
import { getFormsApi } from "@/features/owner/form/services/formService";
import {
	updateServiceApi,
	getServiceByIdApi,
} from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";
import { useServiceStore } from "@/store/serviceStore";

// ===========================
// === Types (local) ===
// ===========================
type Status = {
	value: string;
	label: string;
};

export type WorkOrderConfigItem = {
	positionId: string;
	workOrderFormId: string;
	workReportFormId: string;
	workOrderApprovalType: "auto" | "staff_pic";
	workReportApprovalType: "auto" | "manager";
	minStaff: number;
	maxStaff: number;
};

export const useEditService = () => {
	const navigate = useNavigate();

	// === Route Params ===
	const { id } = useParams<{ id?: string }>();

	// === Loading / Error ===
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [updating, setUpdating] = useState(false);

	// === Cache Store ===
	const serviceStore = useServiceStore();

	const [detailService, setDetailService] = useState<Service | null>(
		id && !serviceStore.isDetailStale(id) ?
			(serviceStore.detailCache[id]?.data ?? null)
		:	null,
	);

	// === Base form fields ===
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [accessType, setAccessType] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [openStatus, setOpenStatus] = useState(false);
	const [isActive, setIsActive] = useState<boolean>(true); // keep track but not change

	const statuses: Status[] = [
		{ value: "true", label: "Aktif" },
		{ value: "false", label: "Non-Aktif" },
	];

	// === Dropdown data ===
	const [positions, setPositions] = useState<Position[]>([]);
	const [forms, setForms] = useState<Form[]>([]);

	// === serviceRequestConfig ===
	const [intakeFormId, setIntakeFormId] = useState<string>("");
	const [reviewFormId, setReviewFormId] = useState<string>("");
	const [serviceRequestApprovalType, setServiceRequestApprovalType] = useState<
		"auto" | "manager"
	>("auto");
	const [reviewNeed, setReviewNeed] = useState<boolean>(false);

	// === workOrdersConfig[] ===
	const [workOrdersConfig, setWorkOrdersConfig] = useState<
		WorkOrderConfigItem[]
	>([]);

	const addWorkOrderConfig = () => {
		setWorkOrdersConfig((prev) => [
			...prev,
			{
				positionId: "",
				workOrderFormId: "",
				workReportFormId: "",
				workOrderApprovalType: "auto",
				workReportApprovalType: "auto",
				minStaff: 1,
				maxStaff: 1,
			},
		]);
	};

	const removeWorkOrderConfig = (index: number) => {
		setWorkOrdersConfig((prev) => prev.filter((_, i) => i !== index));
	};

	const updateWorkOrderConfig = (
		index: number,
		field: keyof WorkOrderConfigItem,
		value: string | number,
	) => {
		setWorkOrdersConfig((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	// === Fetch Data ===
	const fetchPositions = async () => {
		try {
			setLoading(true);
			const res = await getPositionsApi();
			setPositions(res.data ?? []);
		} catch {
			setError("Gagal memuat data posisi");
		} finally {
			setLoading(false);
		}
	};

	const fetchForms = async (): Promise<void> => {
		setLoading(true);
		const { data: res, error } = await handleApi(() => getFormsApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}
		setForms(res?.data || []);
	};

	const populateData = (service: Service) => {
		setTitle(service.title);
		setDescription(service.description);
		setAccessType(service.accessType as unknown as string);
		setIsActive(
			service.isActive === true || service.isActive === ("true" as any),
		);

		if (service.serviceRequestConfig) {
			setIntakeFormId(service.serviceRequestConfig.intakeForm?._id || "");
			setReviewFormId(service.serviceRequestConfig.reviewForm?._id || "");
			setServiceRequestApprovalType(
				service.serviceRequestConfig
					.serviceRequestApprovalAccessType as unknown as "auto" | "manager",
			);
			setReviewNeed(service.serviceRequestConfig.reviewNeed || false);
		}

		if (service.workOrdersConfig) {
			setWorkOrdersConfig(
				service.workOrdersConfig.map((c) => ({
					positionId: c.positionsOnDuty?._id || "",
					workOrderFormId: c.workOrderForm?._id || "",
					workReportFormId: c.workReportForm?._id || "",
					workOrderApprovalType: c.workOrderApprovalAccessType as unknown as
						| "auto"
						| "staff_pic",
					workReportApprovalType: c.workReportApprovalAccessType as unknown as
						| "auto"
						| "manager",
					minStaff: c.minStaff,
					maxStaff: c.maxStaff,
				})),
			);
		}
	};

	// === Get Detail Service (dengan cache 5 menit) ===
	const getDetailService = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat data layanan", "ID layanan tidak ditemukan");
			return;
		}

		// Gunakan cache detail jika masih fresh untuk ID ini
		if (!serviceStore.isDetailStale(id) && serviceStore.detailCache[id]?.data) {
			const data = serviceStore.detailCache[id]!.data;
			setDetailService(data);
			populateData(data);
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getServiceByIdApi(id));
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		const detail = res?.data || null;
		setDetailService(detail);
		if (detail) {
			serviceStore.setDetailService(id, detail); // simpan ke cache
			populateData(detail);
		}
	};

	useEffect(() => {
		if (id) {
			getDetailService();
		}
	}, [id]);

	// === Submit ===
	const updateService = async () => {
		setUpdating(true);
		setError(null);

		if (!title.trim() || !description.trim()) {
			notifyError("Gagal mengupdate", "Judul dan deskripsi wajib diisi");
			setUpdating(false);
			return;
		}
		if (!accessType) {
			notifyError("Gagal mengupdate", "Pilih tipe akses layanan");
			setUpdating(false);
			return;
		}
		if (!intakeFormId) {
			notifyError(
				"Gagal mengupdate",
				"Pilih intake form untuk service request",
			);
			setUpdating(false);
			return;
		}
		if (workOrdersConfig.length === 0) {
			notifyError(
				"Gagal mengupdate",
				"Tambahkan minimal satu konfigurasi work order",
			);
			setUpdating(false);
			return;
		}
		const incompleteWO = workOrdersConfig.some(
			(c) => !c.positionId || !c.workOrderFormId || !c.workReportFormId,
		);
		if (incompleteWO) {
			notifyError("Gagal mengupdate", "Lengkapi semua konfigurasi work order");
			setUpdating(false);
			return;
		}

		const payload: CreateServiceRequest = {
			title,
			description,
			accessType: accessType as unknown as serviceAccessType,
			isActive: Boolean(isActive), // Ensure strict boolean type
			serviceRequestConfig: {
				intakeFormId,
				reviewFormId,
				serviceRequestApprovalAccessType:
					serviceRequestApprovalType as unknown as serviceRequestApprovalAccessType,
				reviewNeed,
			},
			workOrdersConfig: workOrdersConfig.map((c) => ({
				positionId: c.positionId,
				workOrderFormId: c.workOrderFormId,
				workReportFormId: c.workReportFormId,
				workOrderApprovalAccessType:
					c.workOrderApprovalType as unknown as workOrderApprovalAccessType,
				workReportApprovalAccessType:
					c.workReportApprovalType as unknown as workReportApprovalAccessType,
				minStaff: c.minStaff,
				maxStaff: c.maxStaff,
			})),
		};

		const { data: res, error } = await handleApi(() =>
			updateServiceApi(id!, payload),
		);
		setUpdating(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal mengupdate", error.message);
			console.log("Detail validasi:", error.errors);
			return;
		}

		// Hapus cache list agar halaman view-service refresh
		// tapi langsung populate cache detail dengan data terbaru dari response
		// supaya halaman detail tidak perlu fetch ulang
		serviceStore.clearCache();
		// Cek apakah response berupa object { service: ... } atau langsung object Service
		const updatedService = ((res?.data as any)?.service || res?.data) as
			| Service
			| undefined;
		if (updatedService && id) {
			serviceStore.setDetailService(id, updatedService);
		}

		(window as any).__isSubmittingSuccess = true;
		notifySuccess("Layanan berhasil diupdate");
		navigate(-1);
	};

	// === Dirty Check Logic ===
	const isDirty = useMemo(() => {
		if (!detailService) return false;

		const initialIntakeFormId =
			detailService.serviceRequestConfig?.intakeForm?._id || "";
		const initialReviewFormId =
			detailService.serviceRequestConfig?.reviewForm?._id || "";
		const initialApprovalType =
			detailService.serviceRequestConfig?.serviceRequestApprovalAccessType ||
			"auto";
		const initialReviewNeed =
			detailService.serviceRequestConfig?.reviewNeed || false;

		// Deep comparison for workOrdersConfig could be complex, simple length check + first element for now or just skip if too complex
		// For now let's check basic fields
		const isBaseChanged =
			title !== detailService.title ||
			description !== detailService.description ||
			accessType !== (detailService.accessType as unknown as string);

		const isConfigChanged =
			intakeFormId !== initialIntakeFormId ||
			reviewFormId !== initialReviewFormId ||
			serviceRequestApprovalType !== initialApprovalType ||
			reviewNeed !== initialReviewNeed;

		// Basic check for workOrdersConfig length
		const isWorkOrdersChanged =
			workOrdersConfig.length !== (detailService.workOrdersConfig?.length || 0);

		return isBaseChanged || isConfigChanged || isWorkOrdersChanged;
	}, [
		detailService,
		title,
		description,
		accessType,
		intakeFormId,
		reviewFormId,
		serviceRequestApprovalType,
		reviewNeed,
		workOrdersConfig,
	]);

	return {
		// === STATE ===
		loading,
		error,
		updating,
		isDirty,
		title,
		description,
		accessType,
		selectedStatus,
		openStatus,
		statuses,
		positions,
		forms,
		// service request config
		intakeFormId,
		reviewFormId,
		serviceRequestApprovalType,
		reviewNeed,
		// work orders
		workOrdersConfig,
		detailService,

		// === SETTERS ===
		setTitle,
		setDescription,
		setAccessType,
		setSelectedStatus,
		setOpenStatus,
		setIntakeFormId,
		setReviewFormId,
		setServiceRequestApprovalType,
		setReviewNeed,
		setDetailService,

		// === HANDLERS ===
		fetchPositions,
		fetchForms,
		addWorkOrderConfig,
		removeWorkOrderConfig,
		updateWorkOrderConfig,
		updateService,
		getDetailService,
	};
};
