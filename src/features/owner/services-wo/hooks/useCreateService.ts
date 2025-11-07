import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

// API services
import { getPositionsApi } from "@/features/owner/position/services/positionService";
import {
	getFormsApi,
	getFormByIdApi,
} from "@/features/owner/form/services/formService";
import {
	createServiceApi,
	getServicesWoApi,
} from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";

// === Types ===
type Status = {
	value: string;
	label: string;
};

type RoleConfig = {
	fillableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByRoles: string[];
	viewableByPositionIds: string[];
};
export type FormType = "report" | "workOrder" | "intake";
export const useCreateService = () => {
	const navigate = useNavigate();

	// === States dasar ===
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);
	const [services, setServices] = useState<Service[]>([]);

	// === Form fields ===

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [accessType, setAccessType] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [openStatus, setOpenStatus] = useState(false);

	// === Data dropdown ===
	const [positions, setPositions] = useState<Position[]>([]);
	const [forms, setForms] = useState<Form[]>([]);
	const [availableRoles, setAvailableRoles] = useState<
		{ value: string; label: string }[]
	>([]);
	const loadingPositions = loading;
	const errorPositions = error;

	// === Staff dan form ===
	const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
	const [selectedForms, setSelectedForms] = useState<Form[]>([]);
	const [selectedReportForms, setSelectedReportForms] = useState<Form[]>([]);
	const [selectedIntakeForms, setSelectedIntakForms] = useState<Form[]>([]);

	// === Config akses form ===
	const [formAccessConfig, setFormAccessConfig] = useState<
		Record<string, RoleConfig>
	>({});
	const [formAccessConfigReport, setFormAccessConfigReport] = useState<
		Record<string, RoleConfig>
	>({});
	const [formAccessConfigIntake, setFormAccessConfigIntake] = useState<
		Record<string, RoleConfig>
	>({});

	// === Status options ===
	const statuses: Status[] = [
		{ value: "true", label: "Aktif" },
		{ value: "false", label: "Non-Aktif" },
	];

	// === Fetch data ===
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

	useEffect(() => {
		void fetchPositions();
		void fetchForms();
		setAvailableRoles([
			{ value: "manager_company", label: "Manager" },
			{ value: "staff_company", label: "Staff" },
			{ value: "client", label: "Client" },
		]);
	}, []);

	// === Staff handler ===
	const toggleStaff = (pos: Position) => {
		setSelectedStaff((prev) => {
			const exists = prev.some((s) => s.positionId === pos._id);
			if (exists) return prev.filter((s) => s.positionId !== pos._id);
			return [
				...prev,
				{ positionId: pos._id, minimumStaff: 1, maximumStaff: 1 },
			];
		});
	};

	// === Form handler ===
	const toggleForm = async (form: Form) => {
		const alreadySelected = selectedForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		setLoading(true);
		const { data: res, error } = await handleApi(() =>
			getFormByIdApi(form._id)
		);
		setLoading(false);

		if (error) {
			setError("Gagal memuat detail form");
			notifyError("Gagal memuat detail form", error.message);
			return;
		}

		const detailedForm = res?.data;
		if (!detailedForm) return;
		console.log(detailedForm);
		if (detailedForm) {
			setSelectedForms((prev) => [...prev, detailedForm]);
		}
		console.log(detailedForm);
	};

	const toggleReportForm = async (form: Form) => {
		const alreadySelected = selectedReportForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedReportForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		setLoading(true);
		const { data: res, error } = await handleApi(() =>
			getFormByIdApi(form._id)
		);
		setLoading(false);

		if (error) {
			setError("Gagal memuat detail report form");
			notifyError("Gagal memuat detail report form", error.message);
			return;
		}

		const detailedForm = res?.data;
		if (detailedForm) {
			setSelectedReportForms((prev) => [...prev, detailedForm]);
		}
	};

	const toggleIntakeForm = async (form: Form) => {
		const alreadySelected = selectedIntakeForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedIntakForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		setLoading(true);
		const { data: res, error } = await handleApi(() =>
			getFormByIdApi(form._id)
		);
		setLoading(false);

		if (error) {
			setError("Gagal memuat detail intake form");
			notifyError("Gagal memuat detail intake form", error.message);
			return;
		}

		const detailedForm = res?.data;
		if (detailedForm) {
			setSelectedIntakForms((prev) => [...prev, detailedForm]);
		}
	};

	// Helper universal untuk memilih state setter berdasarkan tipe form
	const getSetter = (
		type: FormType
	): React.Dispatch<React.SetStateAction<Record<string, RoleConfig>>> => {
		switch (type) {
			case "report":
				return setFormAccessConfigReport;
			case "workOrder":
				return setFormAccessConfig;
			case "intake":
			default:
				return setFormAccessConfigIntake;
		}
	};

	const toggleRoleFill = (formId: string, role: string, type: FormType) => {
		const setter = getSetter(type);
		setter((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};
			const updated = {
				...current,
				fillableByRoles: current.fillableByRoles.includes(role)
					? current.fillableByRoles.filter((r) => r !== role)
					: [...current.fillableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleRoleView = (formId: string, role: string, type: FormType) => {
		const setter = getSetter(type);
		setter((prev) => {
			const current = prev[formId] || {
				fillableByRoles: [],
				fillableByPositionIds: [],
				viewableByRoles: [],
				viewableByPositionIds: [],
			};
			const updated = {
				...current,
				viewableByRoles: current.viewableByRoles.includes(role)
					? current.viewableByRoles.filter((r) => r !== role)
					: [...current.viewableByRoles, role],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleFillablePosition = (
		formId: string,
		posId: string,
		type: FormType
	) => {
		const setter = getSetter(type);
		setter((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				fillableByPositionIds: current.fillableByPositionIds.includes(posId)
					? current.fillableByPositionIds.filter((id) => id !== posId)
					: [...current.fillableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
	};

	const toggleViewablePosition = (
		formId: string,
		posId: string,
		type: FormType
	) => {
		const setter = getSetter(type);
		setter((prev) => {
			const current = prev[formId]!;
			const updated = {
				...current,
				viewableByPositionIds: current.viewableByPositionIds.includes(posId)
					? current.viewableByPositionIds.filter((id) => id !== posId)
					: [...current.viewableByPositionIds, posId],
			};
			return { ...prev, [formId]: updated };
		});
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
		if (selectedStaff.length === 0) {
			notifyError("Gagal menyimpan", "Pilih minimal satu staff");
			setCreating(false);
			return;
		}

		const payload: CreateServiceRequest = {
			title,
			description,
			isActive: selectedStatus?.value === "true",
			accessType,
			requiredStaff: selectedStaff.map((s) => ({
				positionId: s.positionId,
				minimumStaff: s.minimumStaff,
				maximumStaff: s.maximumStaff,
			})),
			workOrderForms: selectedForms.map((form, i) => {
				const cfg = formAccessConfig[form._id] || {
					fillableByRoles: [],
					viewableByRoles: [],
					fillableByPositionIds: [],
					viewableByPositionIds: [],
				};
				return {
					order: i + 1,
					formId: form._id,
					...cfg,
				};
			}),
			reportForms: selectedReportForms.map((form, i) => {
				const cfg = formAccessConfigReport[form._id] || {
					fillableByRoles: [],
					viewableByRoles: [],
					fillableByPositionIds: [],
					viewableByPositionIds: [],
				};
				return {
					order: i + 1,
					formId: form._id,
					...cfg,
				};
			}),
			clientIntakeForms: selectedIntakeForms.map((form, i) => ({
				order: i + 1,
				formId: form._id,
			})),
		};

		const { data: res, error } = await handleApi(() =>
			createServiceApi(payload)
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
		console.log(service);

		notifySuccess("Layanan berhasil disimpan");
		navigate("/dashboard/owner/services");
	};

	const fecthServices = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getServicesWoApi());

		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		setServices(res?.data || []);
	};

	return {
		// === STATE ===
		loading,
		error,
		title,
		description,
		accessType,
		selectedStatus,
		openStatus,
		statuses,
		positions,
		forms,
		selectedForms,
		selectedReportForms,
		selectedIntakeForms,
		selectedStaff,
		availableRoles,
		formAccessConfig,
		formAccessConfigReport,
		formAccessConfigIntake,
		loadingPositions,
		errorPositions,
		creating,
		services,

		// === SETTERS ===
		setTitle,
		setDescription,
		setAccessType,
		setSelectedStatus,
		setOpenStatus,
		setSelectedStaff,
		fecthServices,

		// === HANDLERS ===
		fetchPositions,
		toggleStaff,
		toggleForm,
		toggleReportForm,
		toggleIntakeForm,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
		createService,
	};
};
