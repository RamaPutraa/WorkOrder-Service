import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useNavigate, useParams } from "react-router-dom";
import {
	cancelSRApi,
	getDetailServiceByIdApi,
	submitIntakeApi,
} from "../services/public-services";
import { useEffect, useState } from "react";
import { uploadFileApi } from "@/lib/file-service";

type FieldValue = string | number | File | string[] | null;
// Changed: Now using field order (number) as key instead of field label (string)
type FormValues = Record<string, Record<number, FieldValue>>;
export const usePublicServices = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<Form[]>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSticky, setIsSticky] = useState(false);
	const [formValues, setFormValues] = useState<FormValues>({});
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const fetchRequesterSRIntakeForm = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat data", "ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailServiceByIdApi(id),
		);

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}

		if (res?.data) setData([res.data]);
	};

	useEffect(() => {
		if (id) fetchRequesterSRIntakeForm();
	}, [id]);

	// useeffect stiky
	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// handle input form - now using field order instead of field label
	const handleChange = (
		formId: string,
		fieldOrder: number,
		value: FieldValue,
		type?: "multi",
	) => {
		setFormValues((prev) => {
			const currentForm = prev[formId] || {};
			const currentValue = currentForm[fieldOrder];

			// MULTI SELECT (checkbox)
			if (type === "multi") {
				let newArray: string[] =
					Array.isArray(currentValue) ? [...currentValue] : [];

				const v = value as string;

				if (newArray.includes(v)) {
					newArray = newArray.filter((item) => item !== v);
				} else {
					newArray.push(v);
				}

				return {
					...prev,
					[formId]: {
						...currentForm,
						[fieldOrder]: newArray,
					},
				};
			}

			// DEFAULT INPUT
			return {
				...prev,
				[formId]: {
					...currentForm,
					[fieldOrder]: value,
				},
			};
		});
	};

	// submit data
	const handleSubmit = async () => {
		if (!data) {
			setError("Tidak ada form yang bisa dikirim.");
			notifyError("Tidak ada form yang bisa dikirim.");
			return;
		}

		setSubmitting(true);
		setError(null);

		// 1. Upload pending files first
		for (const form of data) {
			const formVals = formValues[form._id] || {};

			// Validate mandatory fields for this form
			const missingFields: string[] = [];
			form.fields?.forEach((field) => {
				if (field.required) {
					const value = formVals[field.order];
					const isEmpty =
						value === null ||
						value === undefined ||
						value === "" ||
						(Array.isArray(value) && value.length === 0);
					if (isEmpty) {
						missingFields.push(field.label || `Field #${field.order}`);
					}
				}
			});

			if (missingFields.length > 0) {
				setSubmitting(false);
				notifyError(
					"Validasi Gagal",
					`Harap isi field wajib pada ${form.title}: ${missingFields.join(", ")}`,
				);
				return;
			}

			for (const [orderStr, value] of Object.entries(formVals)) {
				if (value instanceof File) {
					const { error, data: uploadData } = await handleApi(() =>
						uploadFileApi(value),
					);
					if (error || !uploadData) {
						setSubmitting(false);
						notifyError(
							"Gagal mengajukan",
							"Gagal mengunggah gambar. Silakan coba lagi.",
						);
						return;
					}
					// Replace File object with URL string
					formVals[Number(orderStr)] = uploadData.data.url;
				}
			}
		}

		// Build submissions array
		const submissions = data.map((form) => ({
			formId: form._id,
			fieldsData: Object.entries(formValues[form._id] || {}).map(
				([fieldOrder, fieldValue]) => ({
					order: Number(fieldOrder),
					value: fieldValue,
				}),
			),
		}));

		// Wrap in the required format
		const payload: RequesterSubmitRequest = {
			submission: submissions[0],
		};

		const { data: res, error } = await handleApi(() =>
			submitIntakeApi(id!, payload),
		);
		console.log("Payload submitted:", payload);
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
			notifyError("Gagal mengajukan layanan. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	const cancelServiceRequest = async () => {
		if (!id) {
			notifyError("ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			cancelSRApi(id),
		);
		setLoading(false);

		if (error) {
			console.error(error);
			notifyError("Gagal membatalkan layanan", error.message);
			return;
		}

		if (res?.data) {
			notifySuccess("Layanan berhasil dibatalkan!");
			console.log("Response:", res.data);
			navigate("/dashboard/client/submissions");
		} else {
			notifyError("Gagal membatalkan layanan. Respon tidak valid.");
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
		formValues,
		handleChange,
		cancelServiceRequest,
		handleSubmit,
		fetchRequesterSRIntakeForm,
	};
};

export default usePublicServices;
