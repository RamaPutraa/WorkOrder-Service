import { useState, useEffect } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getServiceTemplateApi } from "../services/template-services";
import { useSearchParams } from "react-router-dom";

export const useServiceTemplate = () => {
	const [searchParams] = useSearchParams();
	const companyTypeId = searchParams.get("companyTypeId") ?? "";

	const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchServiceTemplates = async () => {
		if (!companyTypeId) return;

		setLoading(true);
		setError(null);

		const { data, error } = await handleApi(() =>
			getServiceTemplateApi(companyTypeId),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat template layanan", error.message);
			return;
		}

		if (data?.data) {
			setTemplates(data.data);
		}
	};

	const toggleSelection = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	useEffect(() => {
		void fetchServiceTemplates();
	}, [companyTypeId]);

	return {
		templates,
		selectedIds,
		loading,
		error,
		companyTypeId,
		fetchServiceTemplates,
		toggleSelection,
	};
};
