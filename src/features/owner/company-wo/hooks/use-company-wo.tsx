import { handleApi } from "@/lib/handle-api";
import {
	assignStaffToWorkOrderApi,
	getInternalCompanyWorkOrderDetail,
	getInternalCompanyWorkOrders,
	getStaffListForAssign,
} from "../services/company-wo-service";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { type FilterConfig } from "@/shared/molecules/generic-filter";

export const useCompanyWo = () => {
	const { id } = useParams<{ id: string }>();
	const [employees, setEmployees] = useState<StaffItem[]>([]);

	const [data, setData] = useState<WorkOrder[]>([]);
	const [detailData, setDetailData] = useState<WorkOrderDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// fecth employee list
	const fetchEmployeeList = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getStaffListForAssign());

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data karyawan", error.message);
			return;
		}

		setEmployees(res?.data ?? []);
	};
	// Fetch internal company work orders
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

	const fecthDetailInternalCompanyWorkOrder = async (id: string) => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getInternalCompanyWorkOrderDetail(id),
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat detail tugas kerja", error.message);
			return;
		}
		setDetailData(res?.data ?? null);
		console.log(res);
	};

	useEffect(() => {
		void fetchInternalCompanyWorkOrders();
		if (id) fecthDetailInternalCompanyWorkOrder(id);
	}, []);

	// ─── Filter Logic ──────────────────────────────────────────────────────────
	const [searchParams] = useSearchParams();
	const searchQuery = (searchParams.get("search") || "").toLowerCase();
	const statusQuery = searchParams.get("status") || "";
	const dateFromQuery = searchParams.get("date");
	const dateToQuery = searchParams.get("date_end");

	// Menyaring data yang asli (Front-end filtering)
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

				// Set the end date to the end of the day if it exists, otherwise use fromDate
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
		employees,
		detailData,
		data,
		filteredData,
		filterConfig,
		loading,
		error,
		fetchInternalCompanyWorkOrders,
		fecthDetailInternalCompanyWorkOrder,
		fetchEmployeeList,
	};
};
