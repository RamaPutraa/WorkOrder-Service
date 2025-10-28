import { handleApi } from "@/lib/handle-api";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyServiceAPi } from "../services/companyClientService";
import { notifyError } from "@/lib/toast-helper";

const useClientCompanyServices = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [services, setServices] = useState<Service[]>([]);

	const fetchCompanyServices = async () => {
		setLoading(true);
		setError(null);

		if (!id) {
			notifyError("Gagal memuat data", "ID perusahaan tidak ditemukan");
			setLoading(false);
			return;
		}

		const { data: res, error } = await handleApi(() =>
			getCompanyServiceAPi(id)
		);
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		setServices(res?.data || []);
	};

	return {
		fetchCompanyServices,
		services,
		loading,
		error,
	};
};
export default useClientCompanyServices;
