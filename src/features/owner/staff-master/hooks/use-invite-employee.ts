import { useState } from "react";
import { inviteEmployee } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useStaffHistoryStore } from "@/store/staffStore";

export const useInviteEmployee = (onSuccess?: () => void) => {
	const { clearStaffHistorys } = useStaffHistoryStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const invite = async (data: InvitationEmployeeRequest) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => inviteEmployee(data));

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal mengundang pegawai", error.message);
			return;
		}

		if (!res?.data) {
			notifyError("Gagal mengundang pegawai", "Tidak ada data dari server");
			return;
		}

		const count = data.invites.length;
		notifySuccess(
			"Undangan berhasil dikirim",
			`${count} pegawai telah diundang ke perusahaan`,
		);

		clearStaffHistorys();
		onSuccess?.();
	};

	return {
		invite,
		loading,
		error,
	};
};
