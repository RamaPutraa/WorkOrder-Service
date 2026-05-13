import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

// API services
import { getPositionsApi } from "@/features/owner/position/services/positionService";
import { getFormsApi } from "@/features/owner/form/services/formService";
import {
	createServiceApi,
	getServiceByIdApi,
	getServicesWoApi,
	deleteServiceApi,
} from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";
import { type FilterConfig } from "@/shared/molecules/generic-filter";
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

export const useCreateService = () => {
	const navigate = useNavigate();

	// === Route Params ===
	const { id } = useParams<{ id?: string }>();

	// === Loading / Error ===
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	// === Cache Store ===
	const serviceStore = useServiceStore();

	// === List data (dari store atau local state) ===
	const [services, setServices] = useState<Service[]>(
		serviceStore.isServicesStale() ? [] : serviceStore.services,
	);
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
	const [draftingWorkOrderType, setDraftingWorkOrderType] =
		useState<draftingWorkOrderType>("auto");
	const [showReportToRequester, setShowReportToRequester] =
		useState<boolean>(false);

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

	// === Submit ===
	const createService = async () => {
		setCreating(true);
		setError(null);

		if (!title.trim() || !description.trim()) {
			notifyError("Gagal menyimpan", "Judul dan deskripsi wajib diisi");
			setCreating(false);
			return;
		}
		if (!accessType) {
			notifyError("Gagal menyimpan", "Pilih tipe akses layanan");
			setCreating(false);
			return;
		}
		if (!intakeFormId) {
			notifyError("Gagal menyimpan", "Pilih intake form untuk service request");
			setCreating(false);
			return;
		}
		if (workOrdersConfig.length === 0) {
			notifyError(
				"Gagal menyimpan",
				"Tambahkan minimal satu konfigurasi work order",
			);
			setCreating(false);
			return;
		}
		const incompleteWO = workOrdersConfig.some((c) => {
			const isAuto = draftingWorkOrderType === "auto";
			if (isAuto) {
				return !c.positionId || !c.workReportFormId;
			}
			return !c.positionId || !c.workOrderFormId || !c.workReportFormId;
		});
		if (incompleteWO) {
			notifyError("Gagal menyimpan", "Lengkapi semua konfigurasi work order");
			setCreating(false);
			return;
		}

		const isAuto = draftingWorkOrderType === "auto";
		
		const payload: CreateServiceRequest = {
			title,
			description,
			accessType: accessType as unknown as serviceAccessType,
			isActive: selectedStatus?.value === "true",
			drafting_work_order_type: draftingWorkOrderType,
			show_report_to_requester: showReportToRequester,
			serviceRequestConfig: {
				intakeFormId,
				reviewFormId,
				serviceRequestApprovalAccessType: isAuto ?
						"auto"
					:	(serviceRequestApprovalType as unknown as serviceRequestApprovalAccessType),
				reviewNeed,
			},
			workOrdersConfig: workOrdersConfig.map((c) => ({
				positionId: c.positionId,
				workOrderFormId: isAuto ? "" : c.workOrderFormId,
				workReportFormId: c.workReportFormId,
				workOrderApprovalAccessType: isAuto ?
						"auto"
					:	(c.workOrderApprovalType as unknown as workOrderApprovalAccessType),
				workReportApprovalAccessType: isAuto ?
						"auto"
					:	(c.workReportApprovalType as unknown as workReportApprovalAccessType),
				minStaff: c.minStaff,
				maxStaff: c.maxStaff,
			})),
		};

		const { data: res, error } = await handleApi(() =>
			createServiceApi(payload),
		);
		setCreating(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal menyimpan", error.message);
			console.log("Detail validasi:", error.errors);
			return;
		}

		const service = res?.data;
		if (!service) {
			notifyError("Gagal menyimpan", "Data layanan tidak ditemukan");
			return;
		}

		(window as any).__isSubmittingSuccess = true;
		notifySuccess("Layanan berhasil disimpan");
		serviceStore.clearCache();
		navigate(-1);
	};

	// === Dirty Check Logic ===
	const isDirty = useMemo(() => {
		return (
			title !== "" ||
			description !== "" ||
			accessType !== "" ||
			intakeFormId !== "" ||
			draftingWorkOrderType !== "auto" ||
			workOrdersConfig.length > 0
		);
	}, [
		title,
		description,
		accessType,
		intakeFormId,
		draftingWorkOrderType,
		showReportToRequester,
		workOrdersConfig,
	]);

	// === Fetch List Services (dengan cache 5 menit) ===
	const fecthServices = async () => {
		// Gunakan cache jika masih fresh (< 5 menit)
		if (!serviceStore.isServicesStale()) {
			setServices(serviceStore.services);
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getServicesWoApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		const data = res?.data ?? [];
		setServices(data);
		serviceStore.setServices(data); // simpan ke cache beserta timestamp
	};

	// === Get Detail Service (dengan cache 5 menit) ===
	const getDetailService = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat data layanan", "ID layanan tidak ditemukan");
			return;
		}

		// Gunakan cache detail jika masih fresh untuk ID ini
		if (!serviceStore.isDetailStale(id)) {
			setDetailService(serviceStore.detailCache[id]?.data ?? null);
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
		if (detail) serviceStore.setDetailService(id, detail); // simpan ke cache
	};

	const removeService = async (serviceId: string) => {
		setLoading(true);
		const { error } = await handleApi(() => deleteServiceApi(serviceId));
		setLoading(false);

		if (error) {
			notifyError("Gagal menghapus layanan", error.message);
			return false;
		}

		notifySuccess("Berhasil", "Layanan berhasil dihapus");
		serviceStore.clearCache(); // invalidate cache
		await fecthServices();
		return true;
	};

	useEffect(() => {
		if (id) {
			getDetailService();
		}
	}, [id]);

	// === Filter (for view-service page) ===
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const accessTypeQuery = searchParams.get("accessType") || "";
	const statusQuery = searchParams.get("status") || "";

	const filteredData = useMemo(() => {
		return services.filter((service) => {
			const matchesSearch =
				!searchQuery ||
				service.title.toLowerCase().includes(searchQuery) ||
				service.description.toLowerCase().includes(searchQuery);
			const matchesFormType =
				!accessTypeQuery ||
				(service.accessType as unknown as string) === accessTypeQuery;
			const matchesStatus =
				!statusQuery || service.isActive === (statusQuery === "true");
			return matchesSearch && matchesFormType && matchesStatus;
		});
	}, [services, searchQuery, accessTypeQuery, statusQuery]);

	const filterConfig: FilterConfig[] = useMemo(
		() => [
			{
				id: "search",
				label: "Judul/Deskripsi",
				type: "text",
				placeholder: "Cari judul layanan...",
			},
			{
				id: "accessType",
				label: "Jenis Layanan",
				type: "select",
				placeholder: "Semua Jenis Layanan",
				options: [
					{ label: "Internal", value: "internal" },
					{ label: "Publik", value: "public" },
					{ label: "Member Only", value: "member_only" },
				],
			},
			{
				id: "status",
				label: "Status",
				type: "select",
				placeholder: "Semua Status",
				options: [
					{ label: "Aktif", value: "true" },
					{ label: "Tidak Aktif", value: "false" },
				],
			},
		],
		[],
	);

	return {
		// === STATE ===
		loading,
		error,
		creating,
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
		draftingWorkOrderType,
		showReportToRequester,
		// work orders
		workOrdersConfig,
		// list / detail
		services,
		detailService,
		filteredData,
		filterConfig,

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
		setDraftingWorkOrderType,
		setShowReportToRequester,
		setDetailService,

		// === HANDLERS ===
		fetchPositions,
		fetchForms,
		fecthServices,
		getDetailService,
		addWorkOrderConfig,
		removeWorkOrderConfig,
		updateWorkOrderConfig,
		createService,
		removeService,
		// Cache
		clearServiceCache: serviceStore.clearCache,
	};
};
