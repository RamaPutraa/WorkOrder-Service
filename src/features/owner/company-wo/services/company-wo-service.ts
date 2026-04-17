import apiClient from "@/lib/api";

// get all wo
export const getInternalCompanyWorkOrders = async () => {
	const response = await apiClient.get<GetAllWorkOrderResponse>("/workorders");
	return response.data;
};

// get detail wo
export const getInternalCompanyWorkOrderDetail = async (id: string) => {
	const response = await apiClient.get<WorkOrderDetailResponse>(
		`/workorders/${id}`,
	);
	return response.data;
};

// recreate rejected wo
export const recreateRejectedWorkOrderApi = async (id: string) => {
	const response = await apiClient.post<CreateRejectedWorkOrderResponse>(
		`/workorders/${id}/recreate`,
	);
	return response.data;
};

// submit form
export const submitWorkOrderFormApi = async (
	id: string,
	submissions: SubmissionObject,
) => {
	const response = await apiClient.put<SubmitWorkOrderResponse>(
		`/workorders/${id}/submissions`,
		submissions,
	);
	return response.data;
};

// get staff for Wo
export const getStaffListForAssign = async () => {
	const response =
		await apiClient.get<AssignStaffToWorkOrder>("/company/employees");
	return response.data;
};

// assign staff to wo
export const assignStaffToWorkOrderApi = async (
	id: string,
	data: AssignStaffToWorkOrderRequest,
) => {
	const response = await apiClient.put<AssignStaffToWorkOrderResponse>(
		`/workorders/${id}/assign-staffs`,
		data,
	);
	return response.data;
};

// send wo
export const sendWorkOrderApi = async (id: string) => {
	const response = await apiClient.patch<WorkOrderResponse>(
		`/workorders/${id}/sent`,
	);
	return response.data;
};

// approve wo
export const approveWorkOrderApi = async (id: string) => {
	const response = await apiClient.patch<WorkOrderResponse>(
		`/workorders/${id}/approve`,
	);
	return response.data;
};

// reject wo
export const rejectWorkOrderApi = async (id: string) => {
	const response = await apiClient.patch<WorkOrderResponse>(
		`/workorders/${id}/reject`,
	);
	return response.data;
};

// cancel wo
export const cancelWorkOrderApi = async (id: string) => {
	const response = await apiClient.patch<WorkOrderResponse>(
		`/workorders/${id}/cancel`,
	);
	return response.data;
};

// completed wo
export const completeWorkOrderApi = async (
	id: string,
	data: CompleteWorkOrderRequest,
) => {
	const response = await apiClient.patch<CompleteWorkOrderResponse>(
		`/workorders/${id}/complete`,
		data,
	);
	return response.data;
};

// start wo
export const startWorkOrderApi = async (id: string) => {
	const response = await apiClient.patch<WorkOrderResponse>(
		`/workorders/${id}/start`,
	);
	return response.data;
};

// fail wo
export const failWorkOrderApi = async (
	id: string,
	data: FailWorkOrderRequest,
) => {
	const response = await apiClient.patch<FailWorkOrderResponse>(
		`/workorders/${id}/fail`,
		data,
	);
	return response.data;
};

// get work order report
export const getWorkOrderReport = async (id: string) => {
	const response = await apiClient.get<WorkReportResponse>(
		`/workorders/${id}/report`,
	);
	return response.data;
};

// submit wo report
export const submitWorkOrderReportApi = async (
	id: string,
	submission: SubmissionObject,
) => {
	const response = await apiClient.post<WorkReportResponse>(
		`/workreports/${id}/submit`,
		submission,
	);
	return response.data;
};

// sent report
export const sentWorkOrderReportApi = async (
	id: string,
	submissions: SubmissionObject,
) => {
	const response = await apiClient.patch<WorkReportResponse>(
		`/workreports/${id}/sent`,
		submissions,
	);
	return response.data;
};

// approved
export const approvedWorkOrderReportApi = async (id: string) => {
	const response = await apiClient.patch<WorkReportResponse>(
		`/workreports/${id}/approve`,
	);
	return response.data;
};

// reject report
export const rejectWorkOrderReportApi = async (id: string) => {
	const response = await apiClient.patch<WorkReportResponse>(
		`/workreports/${id}/reject`,
	);
	return response.data;
};
