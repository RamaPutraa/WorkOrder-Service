import { useState, useEffect } from "react";
import {
	getInvitedHistory,
	acceptInvitation,
	rejectInvitation,
} from "../services/invitaions";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useAuthStore } from "@/store/authStore";

export const useInvitations = () => {
	const [history, setHistory] = useState<InvitedHistory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
	const [isAlreadyAccepted, setIsAlreadyAccepted] = useState(false);
	const updateUser = useAuthStore((state) => state.updateUser);

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchHistory = async () => {
		setLoading(true);
		setError(null);
		setIsAlreadyAccepted(false);

		const { data: res, error } = await handleApi(() => getInvitedHistory());

		setLoading(false);
		if (error) {
			if (error.code === 403) {
				setIsAlreadyAccepted(true);
				return;
			}
			setError(error.message);
			notifyError("Gagal memuat riwayat undangan", error.message);
			return;
		}

		if (res?.data) {
			setHistory(res.data);
		}
	};

	const handleAccept = async (id: string) => {
		setActionLoadingId(`${id}-accept`);
		const { error } = await handleApi(() => acceptInvitation(id));
		setActionLoadingId(null);

		if (error) {
			notifyError("Gagal menerima undangan", error.message);
			return;
		}

		notifySuccess("Undangan berhasil diterima");

		const invitation = history.find((h) => h._id === id);
		if (invitation && invitation.role) {
			updateUser({
				role: invitation.role,
				...(invitation.company && { company: invitation.company }),
				...(invitation.position && {
					position: invitation.position as Position,
				}),
			});
		}

		fetchHistory();
	};

	const handleReject = async (id: string) => {
		setActionLoadingId(`${id}-reject`);
		const { error } = await handleApi(() => rejectInvitation(id));
		setActionLoadingId(null);

		if (error) {
			notifyError("Gagal menolak undangan", error.message);
			return;
		}

		notifySuccess("Undangan berhasil ditolak");
		fetchHistory();
	};

	return {
		history,
		loading,
		error,
		actionLoadingId,
		isAlreadyAccepted,
		handleAccept,
		handleReject,
		refetch: fetchHistory,
	};
};
