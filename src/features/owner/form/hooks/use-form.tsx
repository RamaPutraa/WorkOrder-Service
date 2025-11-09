import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormByIdApi, getFormsApi } from "../services/formService";

export const useForm = () => {
	const { id } = useParams<{ id?: string }>();
	const [forms, setForms] = useState<Form[]>([]);
	const [detailForm, setDetailForm] = useState<Form | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getAllForms = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getFormsApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}

		setForms(res?.data ?? []);
	};
	const getDetailForm = async () => {
		if (!id) {
			setError("ID form tidak ditemukan");
			notifyError("Gagal memuat data", "ID form tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getFormByIdApi(id));

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}
		setDetailForm(res?.data || null);
	};

	useEffect(() => {
		if (id) void getDetailForm();
		else void getAllForms();
	}, [id]);

	return {
		forms,
		setForms,
		detailForm,
		setDetailForm,
		loading,
		error,
		getDetailForm,
		getAllForms,
	};
};
