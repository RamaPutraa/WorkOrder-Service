import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { generateServiceByTemplateApi } from "../services/template-services";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "@/store/serviceStore";
import { useFormStore } from "@/store/formStore";
import { usePositionStore } from "@/store/potisionStore";

export const useGenerateTemplate = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);

	const clearServiceCache = useServiceStore((state) => state.clearCache);
	const clearFormCache = useFormStore((state) => state.clearCache);
	const clearPositionCache = usePositionStore((state) => state.clearPositions);

	const generateService = async (ids: string[]) => {
		if (ids.length === 0) {
			notifyError("Peringatan", "Pilih setidaknya satu template");
			return;
		}

		setSubmitting(true);

		const { error } = await handleApi(() =>
			generateServiceByTemplateApi({ serviceTemplateIds: ids }),
		);

		setSubmitting(false);

		if (error) {
			notifyError("Gagal menggunakan template", error.message);
			return;
		}

		notifySuccess("Berhasil", "Layanan berhasil dibuat dari template");
		clearServiceCache();
		clearFormCache();
		clearPositionCache();
		navigate("/dashboard/internal/services");
	};

	return {
		submitting,
		generateService,
	};
};
