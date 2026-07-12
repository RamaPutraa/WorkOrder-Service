import { handleApi } from "@/lib/handle-api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
	getAllCompanyApi,
	getCompanyDetailByClientApi,
	getCompanyServiceAPi,
} from "../services/companyClientService";
import { notifyError } from "@/lib/toast-helper";
import type { FilterConfig } from "@/shared/molecules/generic-filter";

const useClientCompanyServices = () => {
	const { id } = useParams();
	const [loadingServices, setLoadingServices] = useState(true);
	const [loadingCompanies, setLoadingCompanies] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [services, setServices] = useState<GetServiceByClient[]>([]);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
	const [isIntegrationActive, setIsIntegrationActive] = useState<boolean>(false);
	const [integrationType, setIntegrationType] = useState<"external_system" | "claim_token" | null>(null);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [companyDetail, setCompanyDetail] = useState<CompanyDetailClient>();

	const fetchCompanyServices = useCallback(async () => {
		if (!id) {
			notifyError("Gagal memuat data", "ID perusahaan tidak ditemukan");
			setLoadingServices(false);
			return;
		}
		setLoadingServices(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getCompanyServiceAPi(id),
		);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
		} else {
			setServices(res?.data ?? []);
		}

		setLoadingServices(false);
	}, [id]);

	const fetchCompanies = useCallback(async (keyword?: string) => {
		setLoadingCompanies(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getAllCompanyApi(keyword),
		);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data perusahaan", error.message);
		} else if (res) {
			setCompanies(res.data ?? []);
		}

		setLoadingCompanies(false);
	}, []);

	const fetchCompanyDetail = useCallback(async () => {
		if (!id) {
			notifyError("Gagal memuat data", "ID perusahaan tidak ditemukan");
			setLoadingCompanies(false);
			return;
		}
		setLoadingCompanies(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getCompanyDetailByClientApi(id),
		);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
		} else {
			setCompanyDetail(res?.data);
			setIsSubscribed(res?.meta.isSubscribed || false);
			setIsIntegrationActive(res?.meta.isIntegrationActive || false);
			setIntegrationType(res?.meta.integrationType || null);
		}

		setLoadingCompanies(false);
	}, [id]);

	useEffect(() => {
		if (id) {
			void fetchCompanyServices();
			void fetchCompanyDetail();
		} else {
			setLoadingServices(false);
			void fetchCompanies();
		}
	}, [id, fetchCompanyServices, fetchCompanyDetail, fetchCompanies]);

	const loading = loadingServices || loadingCompanies;

	// Search company via API (server-side) dengan debounce
	const [searchParams] = useSearchParams();
	const searchQuery = searchParams.get("search") ?? "";
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (id) return; // hanya untuk halaman list company

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			void fetchCompanies(searchQuery || undefined);
		}, 400);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [searchQuery, id, fetchCompanies]);

	// Hasil sudah difilter server-side, tidak perlu filter lagi di client
	const filteredCompanies = companies;

	const filterConfigCompanies: FilterConfig[] = useMemo(
		() => [
			{
				id: "search",
				label: "Nama Perusahaan",
				type: "text",
				placeholder: "Cari perusahaan...",
			},
		],
		[],
	);

	// filtered data service by company
	const [searchParamsService] = useSearchParams();
	const searchQueryService = (
		searchParamsService.get("search") || ""
	).toLowerCase();

	const filteredServices = useMemo(() => {
		return services.filter((service) =>
			service.title.toLowerCase().includes(searchQueryService),
		);
	}, [services, searchQueryService]);

	const filterConfigServices: FilterConfig[] = useMemo(
		() => [
			{
				id: "search",
				label: "Nama Layanan",
				type: "text",
				placeholder: "Cari layanan...",
			},
		],
		[],
	);

	return {
		fetchCompanyServices,
		fetchCompanies,
		fetchCompanyDetail,
		services,
		isSubscribed,
		isIntegrationActive,
		integrationType,
		companies,
		companyDetail,
		loading,
		error,
		filteredCompanies,
		filterConfigCompanies,
		filteredServices,
		filterConfigServices,
	};
};
export default useClientCompanyServices;
