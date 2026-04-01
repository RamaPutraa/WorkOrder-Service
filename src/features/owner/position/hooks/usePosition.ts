import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	createPositionApi,
	getPositionsApi,
	updatePositionApi,
	deletePositionApi,
} from "../services/positionService";
import { handleApi } from "@/lib/handle-api";
import { usePositionStore } from "@/store/potisionStore";

const usePosition = (onSuccess?: () => void) => {
	const store = usePositionStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [positions, setPositions] = useState<Position[]>(
		store.isPositionsStale() ? [] : store.positions,
	);

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
		store.clearPositions();
		navigate(-1);
	};

	const fetchPositions = async () => {
		if (!store.isPositionsStale()) {
			setPositions(store.positions);
			return;
		}
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
		store.setPositions(res?.data || []);
	};

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
		store.clearPositions();
		onSuccess?.();
		return true;
	};

	const removePosition = async (id: string) => {
		setLoading(true);
		const { error } = await handleApi(() => deletePositionApi(id));
		setLoading(false);

		if (error) {
			notifyError("Gagal menghapus posisi", error.message);
			return false;
		}

		notifySuccess("Berhasil", "Posisi berhasil dihapus");
		store.clearPositions(); // invalidate cache
		await fetchPositions();
		return true;
	};

	return {
		createPosition,
		fetchPositions,
		positions,
		loading,
		error,
		updatePosition,
		removePosition,
	};
};

export default usePosition;
