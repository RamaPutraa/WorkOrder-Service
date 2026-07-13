import { useState, useCallback } from "react";
import {
	getStaffInvitationCodes,
	createStaffInvitationCode,
	updateStaffInvitationCode,
	revokeStaffInvitationCode,
} from "../services/staff-service";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";

export const useStaffInvitationCode = () => {
	const [invitationCodes, setInvitationCodes] = useState<StaffInvitationCode[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchInvitationCodes = useCallback(async () => {
		setLoading(true);
		setError(null);
		const { data: res, error: err } = await handleApi(() =>
			getStaffInvitationCodes(),
		);

		setLoading(false);

		if (err) {
			setError(err.message || "Gagal memuat daftar kode undangan");
		} else {
			setInvitationCodes(res?.data ?? []);
		}
	}, []);

	const createInvitationCode = async (
		data: CreateStaffInvitationCodeRequest,
	): Promise<StaffInvitationCode | null> => {
		setSubmitting(true);
		const { data: res, error: err } = await handleApi(() =>
			createStaffInvitationCode(data),
		);

		setSubmitting(false);

		if (err) {
			notifyError(err.message || "Gagal membuat kode undangan");
			return null;
		}

		notifySuccess("Kode undangan berhasil dibuat!");
		await fetchInvitationCodes();
		return res?.data ?? null;
	};

	const toggleInvitationCode = async (id: string, isActive: boolean) => {
		setSubmitting(true);
		const { error: err } = await handleApi(() =>
			updateStaffInvitationCode(id, { isActive }),
		);

		setSubmitting(false);

		if (err) {
			notifyError(err.message || "Gagal mengubah status kode");
			return;
		}

		notifySuccess(
			isActive ? "Kode undangan diaktifkan" : "Kode undangan dinonaktifkan",
		);
		setInvitationCodes((prev) =>
			prev.map((c) => (c._id === id ? { ...c, isActive } : c)),
		);
	};

	const revokeCode = async (id: string) => {
		setSubmitting(true);
		const { error: err } = await handleApi(() => revokeStaffInvitationCode(id));

		setSubmitting(false);

		if (err) {
			notifyError(err.message || "Gagal menghapus kode undangan");
			return;
		}

		notifySuccess("Kode undangan berhasil dihapus");
		setInvitationCodes((prev) => prev.filter((c) => c._id !== id));
	};

	return {
		invitationCodes,
		loading,
		submitting,
		error,
		fetchInvitationCodes,
		createInvitationCode,
		toggleInvitationCode,
		revokeCode,
	};
};
