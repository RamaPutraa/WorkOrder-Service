import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getServiceTemplatePreviewApi } from "../services/template-services";

export const useTemplatePreview = () => {
	const [preview, setPreview] = useState<ServiceTemplatePreview | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPreview = async (templateId: string) => {
		if (!templateId) return;

		setLoading(true);
		setError(null);
		setPreview(null);

		const { data, error } = await handleApi(() =>
			getServiceTemplatePreviewApi(templateId),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat preview template", error.message);
			return;
		}

		if (data?.data) {
			setPreview(data.data);
		}
	};

	return {
		preview,
		loading,
		error,
		fetchPreview,
	};
};
