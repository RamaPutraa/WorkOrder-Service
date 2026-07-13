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

export const getInvitationCodePreview = async (code: string) => {
	const response = await apiClient.get<PreviewInvitationCodeResponse>(
		`/invitation-codes/${code}`,
	);
	return response.data;
};

export const claimInvitationCode = async (code: string) => {
	const response = await apiClient.post<ApiResponse<User>>(
		"/invitation-codes/claim",
		{ code },
	);
	return response.data;
};
