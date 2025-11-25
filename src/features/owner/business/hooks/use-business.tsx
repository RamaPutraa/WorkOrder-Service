import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";
import { getAllInternalBusinessServiceRequestApi } from "../services/internal-business-services";

export const useBusiness = () => {
	const [data, setData] = useState<InternalServiceRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		void fetchInternalServiceRequests();
	}, []);

	return {
		data,
		loading,
		error,
		fetchInternalServiceRequests,
	};
};
