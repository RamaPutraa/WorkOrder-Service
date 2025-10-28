import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useParams } from "react-router-dom";
import { getDetailServiceByIdApi } from "../services/public-services";
import { useEffect, useState } from "react";

export const usePublicServiceDetail = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<Form[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPublicServiceDetail = async () => {
		if (!id) {
			setError("ID layanan tidak ditemukan");
			notifyError("Gagal memuat data", "ID layanan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailServiceByIdApi(id)
		);

		setLoading(false);

		if (error) {
			console.error(error);
			setError(error.message);
			notifyError("Gagal memuat data form", error.message);
			return;
		}

		setData(res?.data?.map((item) => item.form) ?? []);
	};

	useEffect(() => {
		if (id) fetchPublicServiceDetail();
	}, [id]);

	return {
		data,
		loading,
		error,
		fetchPublicServiceDetail,
	};
};

export default usePublicServiceDetail;
