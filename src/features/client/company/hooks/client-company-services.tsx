import { handleApi } from "@/lib/handle-api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
	getAllCompanyApi,
	getCompanyServiceAPi,
} from "../services/companyClientService";
import { notifyError } from "@/lib/toast-helper";

const useClientCompanyServices = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [services, setServices] = useState<Service[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);

	const fetchCompanyServices = async () => {
		setLoading(true);
		setError(null);

		if (!id) {
			notifyError("Gagal memuat data", "ID perusahaan tidak ditemukan");
			setLoading(false);
			return;
		}

		const { data: res, error } = await handleApi(() =>
			getCompanyServiceAPi(id),
		);
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		setServices(res?.data || []);
	};

	const fetchCompanies = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getAllCompanyApi());

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data perusahaan", error.message);
			setLoading(false);
			return;
		}

		if (res) {
			setCompanies(res.data ?? []);
		}

		setLoading(false);
	};

	return {
		fetchCompanyServices,
		fetchCompanies,
		services,
		companies,
		loading,
		error,
	};
};
export default useClientCompanyServices;
