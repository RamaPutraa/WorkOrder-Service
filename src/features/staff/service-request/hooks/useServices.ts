import { getServicesWoApi } from "@/features/owner/services-wo/services/servicesWo";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useEffect, useState } from "react";

export const useServices = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [services, setServices] = useState<Service[]>([]);

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

	useEffect(() => {
		fetchServices();
	}, []);

	return {
		services,
		loading,
		error,
		fetchServices,
	};
};
