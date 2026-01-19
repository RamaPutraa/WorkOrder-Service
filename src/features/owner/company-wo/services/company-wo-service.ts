import apiClient from "@/lib/api";

export const getInternalCompanyWorkOrders = async () => {
	const response =
		await apiClient.get<InternalWorkOrderResponse>("/workorders");
	return response.data;
};

export const getInternalCompanyWorkOrderDetail = async (id: string) => {
	const response = await apiClient.get<DetailInternalWorkOrderResponse>(
		`/workorders/${id}`,
	);
	return response.data;
};

export const assignStaffToWorkOrder = async () => {
	const response =
		await apiClient.get<AssignStaffToWorkOrder>("/company/employees");
	return response.data;
};

export const configStaffWorkOrderApi = async (
	id: string,
	staffEmails: string[],
) => {
	const response = await apiClient.put(`/workorders/${id}/assign-staffs`, {
		staffEmail: staffEmails,
	});
	return response.data;
};

export const submitWorkOrderFormApi = async (
	id: string,
	submissions: PublicSubmission[],
) => {
	const response = await apiClient.put(`/workorders/${id}/submissions`, {
		submissions,
	});
	return response.data;
};
