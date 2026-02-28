import apiClient from "@/lib/api";

export const getInvitedHistory = async () => {
	const response = await apiClient.get<InvitedHistoryResponse>(
		"/invitations/pending",
	);
	return response.data;
};

export const acceptInvitation = async (id: string) => {
	const response = await apiClient.put(`/invitations/${id}/accept`);
	return response;
};

export const rejectInvitation = async (id: string) => {
	const response = await apiClient.put(`/invitations/${id}/reject`);
	return response;
};
