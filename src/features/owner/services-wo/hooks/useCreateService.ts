import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

// API services
import { getPositionsApi } from "@/features/owner/position/services/positionService";
import {
	getFormsApi,
	getFormByIdApi,
} from "@/features/owner/form/services/formService";
import { createServiceApi } from "@/features/owner/services-wo/services/servicesWo";

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

export const useCreateService = () => {
	const navigate = useNavigate();

	// === States dasar ===
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

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

	// === Config akses form ===
	const [formAccessConfig, setFormAccessConfig] = useState<
		Record<string, RoleConfig>
	>({});
	const [formAccessConfigReport, setFormAccessConfigReport] = useState<
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

	const fetchForms = async () => {
		try {
			setLoading(true);
			const res = await getFormsApi();
			setForms(res.data?.forms || []);
		} catch {
			setError("Gagal memuat data form");
		} finally {
			setLoading(false);
		}
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

		try {
			setLoading(true);
			const res = await getFormByIdApi(form._id);
			const detailedForm = res.data?.form;
			if (!detailedForm) return;
			setSelectedForms((prev) => [...prev, detailedForm]);
		} catch {
			setError("Gagal memuat detail form");
		} finally {
			setLoading(false);
		}
	};

	const toggleReportForm = async (form: Form) => {
		const alreadySelected = selectedReportForms.some((f) => f._id === form._id);
		if (alreadySelected) {
			setSelectedReportForms((prev) => prev.filter((f) => f._id !== form._id));
			return;
		}

		try {
			setLoading(true);
			const res = await getFormByIdApi(form._id);
			const detailedForm = res.data?.form;
			if (!detailedForm) return;
			setSelectedReportForms((prev) => [...prev, detailedForm]);
		} catch {
			setError("Gagal memuat detail report form");
		} finally {
			setLoading(false);
		}
	};

	// === Role toggle (form & report) ===
	const toggleRoleFill = (formId: string, role: string, isReport = false) => {
		const setter = isReport ? setFormAccessConfigReport : setFormAccessConfig;
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

	const toggleRoleView = (formId: string, role: string, isReport = false) => {
		const setter = isReport ? setFormAccessConfigReport : setFormAccessConfig;
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
		isReport = false
	) => {
		const setter = isReport ? setFormAccessConfigReport : setFormAccessConfig;
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
		isReport = false
	) => {
		const setter = isReport ? setFormAccessConfigReport : setFormAccessConfig;
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

		try {
			if (!title.trim() || !description.trim()) {
				notifyError("Gagal menyimpan", "Judul dan deskripsi wajib diisi");
				return;
			}
			if (selectedStaff.length === 0) {
				notifyError("Gagal menyimpan", "Pilih minimal satu staff");
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
			};

			const res = await createServiceApi(payload);
			console.log("✅ Response:", res.data);

			notifySuccess("Berhasil", "Layanan berhasil dibuat");
			navigate("/dashboard/owner/services");
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const msg =
					err.response?.data?.error ||
					err.response?.data?.message ||
					"Terjadi kesalahan tak terduga";
				setError(msg);
				notifyError("Gagal membuat layanan", msg);
			} else {
				setError("Terjadi kesalahan internal");
				notifyError("Gagal membuat layanan", "Terjadi kesalahan internal");
			}
		} finally {
			setCreating(false);
		}
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
		selectedStaff,
		availableRoles,
		formAccessConfig,
		formAccessConfigReport,
		loadingPositions,
		errorPositions,
		creating,

		// === SETTERS ===
		setTitle,
		setDescription,
		setAccessType,
		setSelectedStatus,
		setOpenStatus,
		setSelectedStaff,

		// === HANDLERS ===
		fetchPositions,
		toggleStaff,
		toggleForm,
		toggleReportForm,
		toggleRoleFill,
		toggleRoleView,
		toggleFillablePosition,
		toggleViewablePosition,
		createService,
	};
};
