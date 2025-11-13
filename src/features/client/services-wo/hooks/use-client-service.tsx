import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useNavigate, useParams } from "react-router-dom";
import {
	getDetailServiceByIdApi,
	submitIntakeApi,
} from "../services/public-services";
import { useEffect, useState } from "react";

export const usePublicServices = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<Form[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSticky, setIsSticky] = useState(false);
	const [formValues, setFormValues] = useState<
		Record<string, Record<string, string | number>>
	>({});
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const fetchPublicServiceDetail = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat data", "ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailServiceByIdApi(id)
		);

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}

		setData(res?.data?.map((item) => item.form) ?? []);
	};

	useEffect(() => {
		if (id) fetchPublicServiceDetail();
	}, [id]);

	// useeffect stiky
	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// handle input form
	const handleChange = (
		formId: string,
		fieldId: string,
		value: string | number
	) => {
		setFormValues((prev) => ({
			...prev,
			[formId]: {
				...(prev[formId] || {}),
				[fieldId]: value,
			},
		}));
	};

	// submit data
	const handleSubmit = async () => {
		if (!data.length) {
			setError("Tidak ada form yang bisa dikirim.");
			notifyError("Tidak ada form yang bisa dikirim.");
			return;
		}

		setSubmitting(true);
		setError(null);

		const payload: PublicServiceRequest[] = data.map((form) => ({
			formId: form._id,
			fieldsData: Object.entries(formValues[form._id] || {}).map(
				([, fieldValue], i) => ({
					order: i + 1,
					value: fieldValue,
				})
			),
		}));

		const { data: res, error } = await handleApi(() =>
			submitIntakeApi(id!, payload)
		);

		setSubmitting(false);

		if (error) {
			console.error(error);
			notifyError("Gagal mengirim form", error.message);
			return;
		}

		if (res?.data) {
			notifySuccess("Layanan berhasil diajukan!");
			console.log("Response:", res.data);
			navigate("/dashboard/client/submissions");
		} else {
			notifyError("Gagal mengajukan lanyanan. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	return {
		id,
		data,
		loading,
		error,
		isSticky,
		submitting,
		handleChange,
		handleSubmit,
		fetchPublicServiceDetail,
	};
};

export default usePublicServices;
