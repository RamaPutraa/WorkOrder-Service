import apiClient from "@/lib/api";

export const getMembercodesApi = async () => {
	const response =
		await apiClient.get<GetMembercodesResponse>("/memberships/codes");
	return response.data;
};

export const createMembercodeApi = async (body: CreateMembercodeRequest) => {
	const response = await apiClient.post<CreateMembercodesResponse>(
		"/memberships/codes",
		body,
	);
	return response.data;
};

export const deleteMembercodeApi = async (id: string) => {
	const response = await apiClient.delete(`/memberships/codes/${id}`);
	return response.data;
};
