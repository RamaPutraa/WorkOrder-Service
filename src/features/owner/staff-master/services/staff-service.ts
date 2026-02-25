import apiClient from "@/lib/api";

export const getCompanyEmployees = async () => {
	const response =
		await apiClient.get<CompanyEmployeesResponse>("/company/employees");
	return response.data;
};

export const inviteEmployee = async (data: InvitationEmployeeRequest) => {
	const response = await apiClient.post<InvitationEmployeeResponse>(
		"/company/invite",
		data,
	);
	return response.data;
};

export const getInvitationsHistory = async () => {
	const response = await apiClient.get<InvitationsHistoryResponse>(
		"/company/invitations/history",
	);
	return response.data;
};
