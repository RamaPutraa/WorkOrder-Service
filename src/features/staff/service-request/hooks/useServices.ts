import { getServicesWoApi } from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import {
	getSrIntakeFormStaffById,
	submitSrIntakeStaffById,
} from "../services/internal-sr-service";
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

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		if (res?.data) {
			setServices(res.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	const fetchSrIntakeFormStaffById = async (id: string) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getSrIntakeFormStaffById(id),
		);

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		if (res?.data) {
			setIntakeForm(res?.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
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

		const submissions = [
			{
				formId: intakeForm._id,
				fieldsData: Object.entries(formValues[intakeForm._id] || {}).map(
					([fieldOrder, fieldValue]) => ({
						order: Number(fieldOrder),
						value: fieldValue,
					}),
				),
			},
		];

		const payload: RequesterSubmitRequest = {
			submission: submissions[0],
		};

		const { data: res, error } = await handleApi(() =>
			submitSrIntakeStaffById(id, payload),
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
			navigate("/dashboard/staff/services/request");
		} else {
			notifyError("Gagal mengajukan layanan. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	useEffect(() => {
		fetchServices();
		if (id) fetchSrIntakeFormStaffById(id);
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
