import apiClient from "@/lib/api";

export const claimMembershipCode = async (
	data: ClaimMembershipsRequest,
): Promise<CreateMembershipClaimResponse> => {
	const response = await apiClient.post<CreateMembershipClaimResponse>(
		"/memberships/codes/claim",
		data,
	);
	return response.data;
};
