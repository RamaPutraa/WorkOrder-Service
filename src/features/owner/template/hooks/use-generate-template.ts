import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { generateServiceByTemplateApi } from "../services/template-services";
import { useNavigate } from "react-router-dom";

export const useGenerateTemplate = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);

	// TODO:belum riset cachce yang affected
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
		navigate("/dashboard/internal/services");
	};

	return {
		submitting,
		generateService,
	};
};
