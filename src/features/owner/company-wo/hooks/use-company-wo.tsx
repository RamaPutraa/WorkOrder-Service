import { handleApi } from "@/lib/handle-api";
import { getInternalCompanyWorkOrders } from "../services/company-wo-service";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type FilterConfig } from "@/shared/molecules/generic-filter";

/**
 * Hook ini sekarang hanya bertanggung jawab atas:
 * 1. Fetch daftar semua WO (untuk halaman list/view)
 * 2. Fetch daftar employee untuk assign staff
 * 3. Filter logic untuk halaman list
 *
 * Data detail WO sekarang dikelola oleh `useWoDetailSync` + `wo-detail-store` (Zustand cache).
 */
export const useCompanyWo = () => {
	const [data, setData] = useState<WorkOrder[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch daftar semua WO (untuk halaman list)
	const fetchInternalCompanyWorkOrders = async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getInternalCompanyWorkOrders(),
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data tugas kerja", error.message);
			return;
		}
		setData(res?.data ?? []);
	};

	// Hanya fetch list saat tidak ada id (halaman list view)
	useEffect(() => {
		void fetchInternalCompanyWorkOrders();
	}, []);

	// ─── Filter Logic ─────────────────────────────────────────────────────────
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const statusQuery = searchParams.get("status") || "";
	const dateFromQuery = searchParams.get("date");
	const dateToQuery = searchParams.get("date_end");

	const filteredData = useMemo(() => {
		return data.filter((wo) => {
			const matchesSearch =
				!searchQuery ||
				wo.service?.title.toLowerCase().includes(searchQuery) ||
				wo.service?.description?.toLowerCase().includes(searchQuery);

			const matchesStatus =
				!statusQuery || wo.status.toLowerCase() === statusQuery;

			let matchesDate = true;
			if (dateFromQuery) {
				const woDate = new Date(wo.createdAt).getTime();
				const fromDate = new Date(dateFromQuery).getTime();

				const toDate =
					dateToQuery ?
						new Date(dateToQuery).setHours(23, 59, 59, 999)
					:	new Date(dateFromQuery).setHours(23, 59, 59, 999);

				matchesDate = woDate >= fromDate && woDate <= toDate;
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
					{ label: "Dirancang", value: "drafted" },
					{ label: "Siap Dikerjakan", value: "ready" },
					{ label: "Sedang Dikerjakan", value: "in_progress" },
					{ label: "Selesai", value: "completed" },
					{ label: "Dibatalkan", value: "cancelled" },
				],
			},
		],
		[],
	);

	return {
		data,
		filteredData,
		filterConfig,
		loading,
		error,
		fetchInternalCompanyWorkOrders,
	};
};
