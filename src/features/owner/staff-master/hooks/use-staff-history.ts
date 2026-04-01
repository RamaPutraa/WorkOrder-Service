import { useState, useCallback } from "react";
import {
	getInvitationsHistory,
	deleteInvitationApi,
} from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
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

	const removeInvitation = async (id: string) => {
		setLoading(true);
		const { error } = await handleApi(() => deleteInvitationApi(id));
		setLoading(false);

		if (error) {
			notifyError("Gagal menghapus undangan", error.message);
			return false;
		}

		notifySuccess("Berhasil", "Undangan berhasil dihapus"); // Actually I should use notifySuccess! Wait, notifySuccess is not imported. I will import it below.
		store.clearStaffHistorys();
		await fetchHistory();
		return true;
	};

	return {
		history,
		loading,
		error,
		fetchHistory,
		removeInvitation,
	};
};

