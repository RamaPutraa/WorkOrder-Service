import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import {
	approveInternalBusinessServiceRequestApi,
	getAllInternalBusinessServiceRequestApi,
	getDetailInternalBusinessServiceRequestApi,
	rejectInternalBusinessServiceRequestApi,
} from "../services/internal-business-services";
import { useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { type FilterConfig } from "@/shared/molecules/generic-filter";

export const useBusiness = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<InternalServiceRequest[]>([]);
	const [detailData, setDetailData] =
		useState<InternalServiceDetailRequest | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch all internal business service requests
	const fetchInternalServiceRequests = async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getAllInternalBusinessServiceRequestApi(),
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}
		setData(res?.data ?? []);
		console.log(res);
	};

	// fetch detail internal business service requests
	const fetchDetailInternalServiceRequest = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat detail layanan", "ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getDetailInternalBusinessServiceRequestApi(id),
		);

		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat detail layanan", error.message);
			return;
		}
		setDetailData(res?.data ?? null);
		console.log(res);
	};

	const asInputValue = (
		val: string | number | string[] | File | undefined,
	): string | number => {
		if (val instanceof File) return val.name; // file ditampilkan sebagai nama file
		if (Array.isArray(val)) return val.join(", "); // array jadi "a, b, c"
		if (val === undefined) return "";
		return val; // string atau number
	};

	const handleReject = async (id: string) => {
		if (!id) {
			notifyError("Gagal menolak layanan", "ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			rejectInternalBusinessServiceRequestApi(id),
		);
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal menolak layanan", error.message);
			return;
		}

		await fetchInternalServiceRequests();
		console.log(res);
	};

	const handleApprove = async (id: string) => {
		if (!id) {
			notifyError("Gagal menyetujui layanan", "ID layanan tidak ditemukan");
			return;
		}
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			approveInternalBusinessServiceRequestApi(id),
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal menyetujui layanan", error.message);
			return;
		}
		await fetchInternalServiceRequests();
		console.log(res);
	};

	useEffect(() => {
		void fetchInternalServiceRequests();
		if (id) fetchDetailInternalServiceRequest();
	}, [id]);

	// filter logic
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const statusQuery = searchParams.get("status") || "";
	const dateFromQuery = searchParams.get("date");
	const dateToQuery = searchParams.get("date_end");

	// Menyaring data yang asli (Front-end filtering)
	const filteredData = useMemo(() => {
		return data.filter((csr) => {
			const matchesSearch =
				!searchQuery ||
				csr.service?.title.toLowerCase().includes(searchQuery) ||
				csr.service?.description?.toLowerCase().includes(searchQuery);

			const matchesStatus =
				!statusQuery || csr.status.toLowerCase() === statusQuery;

			let matchesDate = true;
			if (dateFromQuery) {
				const csrDate = new Date(csr.createdAt).getTime();
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
	}, [data, searchQuery, statusQuery, dateFromQuery, dateToQuery]);

	// Konfigurasi Field yang dilempar ke komponen GenericFilter
	const filterConfig: FilterConfig[] = useMemo(
		() => [
			{
				id: "search",
				label: "Judul/Deskripsi",
				type: "text",
				placeholder: "Cari judul tugas kerja...",
			},
			{
				id: "date",
				label: "Tanggal Dibuat",
				type: "date-range",
				placeholder: "Pilih rentang waktu",
			},
			{
				id: "status",
				label: "Status",
				type: "select",
				placeholder: "Semua Status",
				options: [
					{ label: "Menunggu Persetujuan", value: "pending" },
					{ label: "Disetujui", value: "approved" },
					{ label: "Ditolak", value: "rejected" },
				],
			},
		],
		[],
	);

	return {
		id,
		detailData,
		data,
		loading,
		error,
		filteredData,
		filterConfig,
		fetchInternalServiceRequests,
		asInputValue,
		fetchDetailInternalServiceRequest,
		handleReject,
		handleApprove,
	};
};
