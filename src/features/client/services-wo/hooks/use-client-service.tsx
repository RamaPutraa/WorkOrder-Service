import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useNavigate, useParams } from "react-router-dom";
import {
	getDetailServiceByIdApi,
	submitIntakeApi,
} from "../services/public-services";
import { useEffect, useState } from "react";

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

	// Load draft
	useEffect(() => {
		if (!data || !id) return;
		const draftKey = `intake-draft-${id}`;
		try {
			const draftStr = localStorage.getItem(draftKey);
			if (draftStr) {
				const draftParsed = JSON.parse(draftStr) as FormValues;
				const initialValues = { ...draftParsed };
				
				data.forEach(form => {
					if (!initialValues[form._id]) return;
					form.fields?.forEach(field => {
						if (field.type === 'image') {
							const val = initialValues[form._id][field.order];
							// Abaikan draft null/kosong khusus untuk field gambar.
							if (!val) {
								delete initialValues[form._id][field.order];
							}
						}
					});
				});

				setFormValues(initialValues);
			}
		} catch (e) {
			console.error("Failed to load intake draft", e);
		}
	}, [data, id]);

	// Save draft
	useEffect(() => {
		if (!id || !data) return;
		const draftKey = `intake-draft-${id}`;
		if (Object.keys(formValues).length === 0) return;
		
		const draftObj: FormValues = {};
		data.forEach(form => {
			if (!formValues[form._id]) return;
			form.fields?.forEach(field => {
				if (field.type === 'image') {
					const val = formValues[form._id][field.order];
					// Hanya simpan jika val ada (tidak null)
					if (val !== undefined && val !== null) {
						if (!draftObj[form._id]) draftObj[form._id] = {};
						draftObj[form._id][field.order] = val;
					}
				}
			});
		});

		if (Object.keys(draftObj).length > 0) {
			localStorage.setItem(draftKey, JSON.stringify(draftObj));
		} else {
			localStorage.removeItem(draftKey);
		}
	}, [formValues, id, data]);

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
			const draftKey = `intake-draft-${id}`;
			localStorage.removeItem(draftKey);
			console.log("Response:", res.data);
			navigate("/dashboard/client/submissions");
		} else {
			notifyError("Gagal mengajukan layanan. Respon tidak valid.");
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
		handleSubmit,
		fetchRequesterSRIntakeForm,
	};
};

export default usePublicServices;
