import { useState, useEffect } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getCompanyTypeApi } from "../services/template-services";

export const useCompanyType = () => {
	const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCompanyTypes = async () => {
		setLoading(true);
		setError(null);

		const { data, error } = await handleApi(() => getCompanyTypeApi());

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat tipe perusahaan", error.message);
			return;
		}

		if (data?.data) {
			setCompanyTypes(data.data);
		}
	};

	useEffect(() => {
		void fetchCompanyTypes();
	}, []);

	return {
		companyTypes,
		loading,
		error,
		fetchCompanyTypes,
	};
};
