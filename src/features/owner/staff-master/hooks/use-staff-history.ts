import { useState, useCallback } from "react";
import { getInvitationsHistory } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useStaffHistoryStore } from "@/store/staffStore";

export const useStaffHistory = () => {
	const store = useStaffHistoryStore();

	const [history, setHistory] = useState<InvitationsHistory[]>(
		store.isStaffHistoryStale() ? [] : store.staffHistorys,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchHistory = useCallback(async () => {
		// Gunakan cache jika masih fresh (< 5 menit)
		if (!store.isStaffHistoryStale()) {
			setHistory(store.staffHistorys);
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getInvitationsHistory());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat riwayat undangan", error.message);
			return;
		}

		const data = res?.data || [];
		setHistory(data);
		store.setStaffHistorys(data); // Simpan ke cache beserta timestamp
	}, [store]);

	return {
		history,
		loading,
		error,
		fetchHistory,
	};
};

