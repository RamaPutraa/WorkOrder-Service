import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getFormByIdApi, getFormsApi } from "../services/formService";
import { type FilterConfig } from "@/shared/molecules/generic-filter";

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

	// filter data
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const formTypeQuery = searchParams.get("formType") || "";
	const dateFromQuery = searchParams.get("date");
	const dateToQuery = searchParams.get("date_end");

	// Menyaring data yang asli (Front-end filtering)
	const filteredData = useMemo(() => {
		return forms.filter((form) => {
			const matchesSearch =
				!searchQuery ||
				form.title.toLowerCase().includes(searchQuery) ||
				form.description?.toLowerCase().includes(searchQuery);

			const matchesStatus =
				!formTypeQuery || form.formType.toLowerCase() === formTypeQuery;

			let matchesDate = true;
			if (dateFromQuery) {
				const csrDate = new Date(form.createdAt).getTime();
				const fromDate = new Date(dateFromQuery).getTime();

				// Set the end date to the end of the day if it exists, otherwise use fromDate
				const toDate =
					dateToQuery ?
						new Date(dateToQuery).setHours(23, 59, 59, 999)
					:	new Date(dateFromQuery).setHours(23, 59, 59, 999);

				matchesDate = csrDate >= fromDate && csrDate <= toDate;
			}

			return matchesSearch && matchesStatus && matchesDate;
		});
	}, [forms, searchQuery, formTypeQuery, dateFromQuery, dateToQuery]);

	// Konfigurasi Field yang dilempar ke komponen GenericFilter
	const filterConfig: FilterConfig[] = useMemo(
		() => [
			{
				id: "search",
				label: "Judul/Deskripsi",
				type: "text",
				placeholder: "Cari judul formulir...",
			},
			{
				id: "date",
				label: "Tanggal Dibuat",
				type: "date-range",
				placeholder: "Pilih rentang waktu dibuat",
			},
			{
				id: "formType",
				label: "Jenis Form",
				type: "select",
				placeholder: "Semua Jenis Form",
				options: [
					{ label: "Pengajuan Layanan", value: "intake" },
					{ label: "Perintah Kerja", value: "work_order" },
					{ label: "Laporan", value: "report" },
				],
			},
		],
		[],
	);

	return {
		forms,
		filteredData,
		filterConfig,
		setForms,
		detailForm,
		setDetailForm,
		loading,
		error,
		getDetailForm,
		getAllForms,
	};
};
