import { handleApi } from "@/lib/handle-api";
import { getInternalCompanyWorkOrders } from "../services/company-wo-service";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";

export const useCompanyWo = () => {
	const [data, setData] = useState<InternalWorkOrder[]>([]);
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

	useEffect(() => {
		void fetchInternalCompanyWorkOrders();
	}, []);

	return {
		data,
		loading,
		error,
		fetchInternalCompanyWorkOrders,
	};
};
