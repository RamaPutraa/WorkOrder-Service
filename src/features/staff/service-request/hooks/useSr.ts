import { useEffect, useState } from "react";
import { getSrHistory, getSrById } from "../services/internal-sr-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useParams } from "react-router-dom";

export const useServicesRequest = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<RequesterSR[]>([]);
	const [srById, setSrById] = useState<RequesterSRDetailRequest>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSrHistory = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getSrHistory());

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		if (res?.data) {
			setData(res.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	const fetchSrById = async (id: string) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getSrById(id));

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		if (res?.data) {
			setSrById(res.data);
		} else {
			notifyError("Gagal memuat data. Respon tidak valid.");
			console.error("Response:", res);
		}
	};

	useEffect(() => {
		fetchSrHistory();
		if (id) fetchSrById(id);
	}, [id]);

	return {
		data,
		loading,
		error,
		fetchSrHistory,
		fetchSrById,
		srById,
	};
};
