import { handleApi } from "@/lib/handle-api";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
	getAllCompanyApi,
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
	const [companies, setCompanies] = useState<Company[]>([]);

	const fetchCompanyServices = async () => {
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
			setServices(res?.data?.services || []);
			setIsSubscribed(res?.data?.isSubscribed || false);
		}

		setLoadingServices(false);
	};

	const fetchCompanies = async () => {
		setLoadingCompanies(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getAllCompanyApi());

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data perusahaan", error.message);
		} else if (res) {
			setCompanies(res.data ?? []);
		}

		setLoadingCompanies(false);
	};

	useEffect(() => {
		if (id) {
			void fetchCompanyServices();
		} else {
			setLoadingServices(false);
		}
		void fetchCompanies();
	}, [id]);

	const loading = loadingServices || loadingCompanies;

	// filterdata company
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();

	const filteredCompanies = useMemo(() => {
		return companies.filter((company) =>
			company.name.toLowerCase().includes(searchQuery),
		);
	}, [companies, searchQuery]);

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
		services,
		isSubscribed,
		companies,
		loading,
		error,
		filteredCompanies,
		filterConfigCompanies,
		filteredServices,
		filterConfigServices,
	};
};
export default useClientCompanyServices;
