import { useState } from "react";
import { claimMembercodeApi } from "../services/claimMembership";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

export const useClaimMembership = (onSuccess?: () => void) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const claim = async (data: claimMembercodeRequest) => {
		setLoading(true);
		setError(null);

		const { error } = await handleApi(() =>
			claimMembercodeApi(data),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal mengklaim token", error.message);
			return;
		}

		notifySuccess(
			"Token berhasil diklaim",
			"Anda kini memiliki akses ke layanan berlangganan"
		);

		onSuccess?.();
	};

	return {
		claim,
		loading,
		error,
	};
};
