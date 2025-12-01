import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import {
	approveInternalBusinessServiceRequestApi,
	getAllInternalBusinessServiceRequestApi,
	getDetailInternalBusinessServiceRequestApi,
	rejectInternalBusinessServiceRequestApi,
} from "../services/internal-business-services";
import { useParams } from "react-router-dom";

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
			getAllInternalBusinessServiceRequestApi()
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
			getDetailInternalBusinessServiceRequestApi(id)
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
		val: string | number | string[] | File | undefined
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
			rejectInternalBusinessServiceRequestApi(id)
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
			approveInternalBusinessServiceRequestApi(id)
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

	return {
		id,
		detailData,
		data,
		loading,
		error,
		fetchInternalServiceRequests,
		asInputValue,
		fetchDetailInternalServiceRequest,
		handleReject,
		handleApprove,
	};
};
