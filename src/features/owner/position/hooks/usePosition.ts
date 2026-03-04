import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	createPositionApi,
	getPositionsApi,
	updatePositionApi,
} from "../services/positionService";
import { handleApi } from "@/lib/handle-api";

const usePosition = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [positions, setPositions] = useState<Position[]>([]);

	// create position
	const createPosition = async (data: PositionRequest) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => createPositionApi(data));

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal membuat posisi", error.message);
			console.log("Detail validasi:", error.errors);
			return;
		}

		const position = res?.data;
		if (!position) {
			notifyError("Gagal membuat posisi", "Data posisi tidak ditemukan");
			return;
		}

		notifySuccess(
			"Posisi berhasil dibuat",
			`Posisi ${position.name} telah ditambahkan`,
		);
		navigate("/dashboard/internal/positions");
	};

	const fetchPositions = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getPositionsApi());

		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data posisi", error.message);
			return;
		}

		setPositions(res?.data || []);
	};

	return {
		createPosition,
		fetchPositions,
		positions,
		loading,
		error,
	};
};

export default usePosition;

export const useUpdatePosition = (onSuccess?: () => void) => {
	const [loading, setLoading] = useState(false);

	const updatePosition = async (id: string, data: UpdatePositionRequest) => {
		setLoading(true);
		const { data: res, error } = await handleApi(() =>
			updatePositionApi(id, data),
		);
		setLoading(false);

		if (error) {
			notifyError("Gagal memperbarui posisi", error.message);
			return false;
		}

		notifySuccess(
			"Berhasil",
			`Posisi ${res?.data?.name ?? ""} berhasil diperbarui`,
		);
		onSuccess?.();
		return true;
	};

	return { updatePosition, loading };
};
