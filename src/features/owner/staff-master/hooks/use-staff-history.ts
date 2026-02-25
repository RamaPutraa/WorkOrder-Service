import { useState, useEffect } from "react";
import { getInvitationsHistory } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";

export const useStaffHistory = () => {
	const [history, setHistory] = useState<InvitationsHistory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchHistory = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getInvitationsHistory());

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat riwayat undangan", error.message);
			return;
		}

		if (res?.data?.invitations) {
			setHistory(res.data.invitations);
		}
	};

	return {
		history,
		loading,
		error,
		refetch: fetchHistory,
	};
};
