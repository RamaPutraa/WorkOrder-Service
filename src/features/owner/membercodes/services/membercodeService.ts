import apiClient from "@/lib/api";

export const getMembercodesApi = async () => {
	const response =
		await apiClient.get<getAllMembercodeResponse>("/memberships/codes");
	return response.data;
};

export const uploadMembercodeApi = async (data: createMemberCodeRequest) => {
	const response = await apiClient.post<createMemberCodeResponse>(
		"/memberships/codes",
		data,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
	return response.data;
};

export const claimMembercodeApi = async (data: claimMembercodeRequest) => {
	const response = await apiClient.post<claimMembercodeResponse>(
		"/memberships/codes/claim",
		data,
	);
	return response.data;
};

export const deleteMembercodeApi = async (id: string) => {
	const response = await apiClient.delete<deleteMemberCodeResponse>(
		`/memberships/codes/${id}`,
	);
	return response.data;
};

// export const createMembercodeApi = async (body: CreateMembercodeRequest) => {
// 	const response = await apiClient.post<CreateMembercodesResponse>(
// 		"/memberships/codes",
// 		body,
// 	);
// 	return response.data;
// };

