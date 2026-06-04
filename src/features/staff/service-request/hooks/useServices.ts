import { getServicesWoApi } from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import {
	getSrIntakeFormStaffById,
	submitSrIntakeStaffById,
} from "../services/internal-sr-service";
import { uploadFileApi } from "@/lib/file-service";
import { useParams, useNavigate } from "react-router-dom";

type FieldValue = string | number | File | string[] | null;
type FormValues = Record<string, Record<number, FieldValue>>;

export const useServices = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [services, setServices] = useState<Service[]>([]);
	const [intakeForm, setIntakeForm] = useState<Form>();
	const [isSticky, setIsSticky] = useState(false);
	const [formValues, setFormValues] = useState<FormValues>({});
	const [submitting, setSubmitting] = useState(false);

	const fetchServices = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getServicesWoApi());

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			setLoading(false);
			return;
		}

		if (res?.data) {
			setServices(res.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
		setLoading(false);
	};

	const fetchSrIntakeFormStaffById = async (id: string) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getSrIntakeFormStaffById(id),
		);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			setLoading(false);
			return;
		}

		if (res?.data) {
			setIntakeForm(res?.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
		setLoading(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleChange = (
		formId: string,
		fieldOrder: number,
		value: FieldValue,
		type?: "multi",
	) => {
		setFormValues((prev) => {
			const currentForm = prev[formId] || {};
			const currentValue = currentForm[fieldOrder];

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

			return {
				...prev,
				[formId]: {
					...currentForm,
					[fieldOrder]: value,
				},
			};
		});
	};

	const handleSubmit = async () => {
		if (!intakeForm || !id) {
			setError("Tidak ada form yang bisa dikirim.");
			notifyError("Tidak ada form yang bisa dikirim.");
			return;
		}

		setSubmitting(true);
		setError(null);

		// Ambil field data dari form
		const rawFieldsData = Object.entries(formValues[intakeForm._id] || {}).map(
			([fieldOrder, fieldValue]) => ({
				order: Number(fieldOrder),
				value: fieldValue,
			}),
		);

		// 1. Upload semua file gambar terlebih dahulu
		for (const fd of rawFieldsData) {
			if (fd.value instanceof File) {
				const { error, data } = await handleApi(() =>
					uploadFileApi(fd.value as File),
				);
				if (error || !data) {
					setSubmitting(false);
					notifyError(
						"Gagal mengirim form",
						"Gagal mengunggah gambar. Silakan coba lagi.",
					);
					return;
				}
				// Ganti File object dengan URL string hasil upload
				fd.value = data.data.url;
			}
		}

		const payload: RequesterSubmitRequest = {
			submission: {
				formId: intakeForm._id,
				fieldsData: rawFieldsData as FieldData[],
			},
		};

		const { data: res, error } = await handleApi(() =>
			submitSrIntakeStaffById(id, payload),
		);
		setSubmitting(false);

		if (error) {
			console.error(error);
			notifyError("Gagal mengirim form", error.message);
			return;
		}

		if (res?.data) {
			notifySuccess("Layanan berhasil diajukan!");
			navigate("/dashboard/staff/services-request/history");
		} else {
			notifyError("Gagal mengajukan layanan. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	useEffect(() => {
		if (id) {
			fetchSrIntakeFormStaffById(id);
		} else {
			fetchServices();
		}
	}, [id]);

	return {
		services,
		isSticky,
		formValues,
		submitting,
		handleChange,
		handleSubmit,
		loading,
		error,
		intakeForm,
		fetchServices,
		fetchSrIntakeFormStaffById,
	};
};
