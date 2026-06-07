import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getDetailPositionApi } from "../services/positionService";

const useDetailPosition = () => {
	const [position, setPosition] = useState<DetailPositision | null>(null);
	const [canDelete, setCanDelete] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDetailPosition = async (id: string) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailPositionApi(id),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat detail departemen", error.message);
			return;
		}

		setPosition(res?.data ?? null);
		setCanDelete(res?.meta?.canDelete ?? false);
	};

	return {
		position,
		canDelete,
		loading,
		error,
		fetchDetailPosition,
	};
};

export default useDetailPosition;
