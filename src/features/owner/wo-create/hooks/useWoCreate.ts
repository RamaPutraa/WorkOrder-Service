import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import {
	getServicesWoApi,
	getServiceByIdApi,
} from "@/features/owner/services-wo/services/servicesWo";
import { createWorkOrderApi } from "../services/wo-create-services";
import { useServiceStore } from "@/store/serviceStore";
import { type FilterConfig } from "@/shared/molecules/generic-filter";

export const useWoCreate = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id?: string }>();
	const serviceStore = useServiceStore();

	// === State ===
	const [loading, setLoading] = useState(false);
	const [creatingWo, setCreatingWo] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [services, setServices] = useState<Service[]>(
		serviceStore.isServicesStale() ? [] : serviceStore.services,
	);
	const [detailService, setDetailService] = useState<Service | null>(
		id && !serviceStore.isDetailStale(id) ?
			(serviceStore.detailCache[id]?.data ?? null)
		:	null,
	);

	// === Fetch List ===
	const fetchServices = async () => {
		if (!serviceStore.isServicesStale()) {
			setServices(serviceStore.services);
			return;
		}
		setLoading(true);
		setError(null);
		const { data: res, error: err } = await handleApi(() => getServicesWoApi());
		setLoading(false);
		if (err) {
			setError(err.message);
			notifyError("Gagal memuat data layanan", err.message);
			return;
		}
		const data = res?.data ?? [];
		setServices(data);
		serviceStore.setServices(data);
	};

	// === Fetch Detail ===
	const fetchDetailService = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			return;
		}
		if (!serviceStore.isDetailStale(id)) {
			setDetailService(serviceStore.detailCache[id]?.data ?? null);
			return;
		}
		setLoading(true);
		setError(null);
		const { data: res, error: err } = await handleApi(() =>
			getServiceByIdApi(id),
		);
		setLoading(false);
		if (err) {
			setError(err.message);
			notifyError("Gagal memuat detail layanan", err.message);
			return;
		}
		const detail = res?.data ?? null;
		setDetailService(detail);
		if (detail) serviceStore.setDetailService(id, detail);
	};

	// === Auto fetch detail when id changes ===
	useEffect(() => {
		if (id) {
			fetchDetailService();
		}
	}, [id]);

	// === Create Work Order ===
	const createWorkOrder = async (serviceId: string) => {
		setCreatingWo(true);
		const { data: res, error: err } = await handleApi(() =>
			createWorkOrderApi(serviceId),
		);
		setCreatingWo(false);
		if (err) {
			notifyError("Gagal membuat perintah kerja", err.message);
			return false;
		}
		const workOrder = res?.data;
		if (!workOrder) {
			notifyError("Gagal membuat perintah kerja", "Data tidak ditemukan");
			return false;
		}
		notifySuccess("Perintah kerja berhasil dibuat!");
		// Navigasi ke halaman detail work order
		navigate(`/dashboard/internal/workorders/detail/${workOrder._id}`);
		return true;
	};

	// === Filter ===
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const accessTypeQuery = searchParams.get("accessType") || "";
	const statusQuery = searchParams.get("status") || "";

	const filteredData = useMemo(() => {
		return services
			.filter((s) => s.isActive) // hanya layanan aktif
			.filter((service) => {
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
				placeholder: "Cari nama layanan...",
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
		],
		[],
	);

	return {
		loading,
		creatingWo,
		error,
		services,
		filteredData,
		filterConfig,
		detailService,
		fetchServices,
		fetchDetailService,
		createWorkOrder,
	};
};
