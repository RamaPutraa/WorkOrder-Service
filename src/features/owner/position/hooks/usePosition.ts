import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	createPositionApi,
	getPositionsApi,
} from "../services/positionService";
import { handleApi } from "@/lib/handle-api";

const usePosition = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [positions, setPositions] = useState<Position[]>([]);

	//  TODO: tinggal auth
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
			`Posisi ${position.name} telah ditambahkan`
		);
		navigate("/dashboard/owner/positions");
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
