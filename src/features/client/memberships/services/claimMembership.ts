import apiClient from "@/lib/api";

export const claimMembercodeApi = async (data: claimMembercodeRequest) => {
	const response = await apiClient.post<claimMembercodeResponse>(
		"/memberships/codes/claim",
		data,
	);
	return response.data;
};
