import { handleApi } from "@/lib/handle-api";
import {
	getInternalCompanyWorkOrderDetail,
	getInternalCompanyWorkOrders,
} from "../services/company-wo-service";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useCompanyWo = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<InternalWorkOrder[]>([]);
	const [detailData, setDetailData] = useState<DetailInternalWorkOrder | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch internal company work orders
	const fetchInternalCompanyWorkOrders = async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getInternalCompanyWorkOrders()
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data tugas kerja", error.message);
			return;
		}
		setData(res?.data ?? []);
		console.log(res);
	};

	const fecthDetailInternalCompanyWorkOrder = async (id: string) => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getInternalCompanyWorkOrderDetail(id)
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

	return {
		data,
		detailData,
		loading,
		error,
		fetchInternalCompanyWorkOrders,
		fecthDetailInternalCompanyWorkOrder,
	};
};
