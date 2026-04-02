import { useState } from "react";
import { claimMembershipCode } from "../services/claimMembership";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

export const useClaimMembership = (onSuccess?: () => void) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const claim = async (data: ClaimMembershipsRequest) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			claimMembershipCode(data),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal mengklaim membership", error.message);
			return;
		}

		if (!res?.data) {
			notifyError("Gagal mengklaim membership", "Tidak ada data dari server");
			return;
		}

		notifySuccess(
			"Membership berhasil diklaim",
			`Anda kini berlangganan di ${res.data.company?.name ?? "perusahaan"}`,
		);

		onSuccess?.();
	};

	return {
		claim,
		loading,
		error,
	};
};
