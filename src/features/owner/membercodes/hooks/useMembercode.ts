import { useState, useCallback } from "react";
import { handleApi } from "@/lib/handle-api";
import { getMembercodesApi } from "../services/membercodeService";
import { notifyError } from "@/lib/toast-helper";
import type { Membercode } from "../types/membercode";
import { useMembercodeStore } from "@/store/membercodeStore";

export const useMembercode = () => {
	const store = useMembercodeStore();

	const [membercodes, setMembercodes] = useState<Membercode[]>(
		store.isMembercodesStale() ? [] : store.membercodes,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMembercodes = useCallback(async () => {
		// Gunakan cache jika masih fresh (< 5 menit)
		if (!store.isMembercodesStale()) {
			setMembercodes(store.membercodes);
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getMembercodesApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal mengambil kode berlangganan", error.message);
			return;
		}

		const data = res?.data || [];
		setMembercodes(data);
		store.setMembercodes(data); // Simpan ke cache beserta timestamp
	}, [store]);

	return {
		membercodes,
		loading,
		error,
		fetchMembercodes,
	};
};