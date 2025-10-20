import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPositionApi } from "../services/positionService";
import axios from "axios";

const usePosition = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// create position
	const createPosition = async (data: PositionRequest) => {
		setLoading(true);
		setError(null);
		try {
			const ress: SinglePositionResponse = await createPositionApi(data);
			const position = ress.data;
			if (!position) {
				notifyError("Gagal membuat posisi", "Posisi tidak ditemukan");
				return;
			}

			notifySuccess(
				"Posisi berhasil dibuat",
				`Posisi ${position.name} telah ditambahkan`
			);
			navigate("/dashboard/owner/positions");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.message || "Terjadi kesalahan");
				notifyError(
					"Gagal membuat posisi",
					error.response?.data.message || "Terjadi kesalahan"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		createPosition,
		loading,
		error,
	};
};

export default usePosition;
