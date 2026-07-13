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

export const getDetailEmployeeApi = async (id: string) => {
	const response = await apiClient.get<DetailEmployeeResponse>(`/company/employees/${id}`);
	return response.data;
};

export const kickEmployeeApi = async (data: KickEmployeeRequest) => {
	const response = await apiClient.delete<KickEmployeeResponse>(`/company/employees`, { data });
	return response.data;
};

export const deleteInvitationApi = async (id: string) => {
	const response = await apiClient.delete(`/invitations/${id}`);
	return response.data;
};

// ─── Invitation Code APIs ─────────────────────────────────────────────────

export const createStaffInvitationCode = async (
	data: CreateStaffInvitationCodeRequest,
) => {
	const response = await apiClient.post<StaffInvitationCodeResponse>(
		"/company/invitation-codes",
		data,
	);
	return response.data;
};

export const getStaffInvitationCodes = async () => {
	const response = await apiClient.get<StaffInvitationCodeListResponse>(
		"/company/invitation-codes",
	);
	return response.data;
};

export const updateStaffInvitationCode = async (
	id: string,
	data: UpdateStaffInvitationCodeRequest,
) => {
	const response = await apiClient.patch<StaffInvitationCodeResponse>(
		`/company/invitation-codes/${id}`,
		data,
	);
	return response.data;
};

export const revokeStaffInvitationCode = async (id: string) => {
	const response = await apiClient.delete<ApiResponse<{ _id: string }>>(
		`/company/invitation-codes/${id}`,
	);
	return response.data;
};
