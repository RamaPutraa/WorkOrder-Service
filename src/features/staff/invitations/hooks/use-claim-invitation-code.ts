import { useState, useCallback } from "react";
import { getInvitationCodePreview, claimInvitationCode } from "../services/invitaions";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

export const useClaimInvitationCode = () => {
	const [previewData, setPreviewData] = useState<PreviewInvitationCodeData | null>(null);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const previewCode = useCallback(async (code: string): Promise<boolean> => {
		setLoading(true);
		const { data: res, error: err } = await handleApi(() =>
			getInvitationCodePreview(code),
		);
		setLoading(false);

		if (err) {
			notifyError(err.message || "Kode tidak valid atau sudah tidak bisa diklaim");
			setPreviewData(null);
			return false;
		}

		if (res?.data) {
			setPreviewData(res.data);
			return true;
		}

		return false;
	}, []);

	const claimCode = useCallback(async (code: string): Promise<User | null> => {
		setSubmitting(true);
		const { data: res, error: err } = await handleApi(() =>
			claimInvitationCode(code),
		);
		setSubmitting(false);

		if (err) {
			notifyError(err.message || "Gagal mengklaim kode undangan");
			return null;
		}

		notifySuccess("Berhasil bergabung dengan perusahaan!");
		return res?.data ?? null;
	}, []);

	const resetPreview = useCallback(() => {
		setPreviewData(null);
	}, []);

	return {
		previewData,
		loading,
		submitting,
		previewCode,
		claimCode,
		resetPreview,
	};
};
