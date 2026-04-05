import apiClient from "@/lib/api";
import { dummyInternalWorkOrders } from "../mocks/internal-work-order.mock";

const USE_MOCK = true; // TODO: Ubah ke false jika API backend sudah siap

export const getInternalCompanyWorkOrders = async () => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyInternalWorkOrders,
			message: "Success (Mock)",
			status: 200,
		} as InternalWorkOrderResponse;
	}

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
	submissions: SubmissionObject[],
) => {
	const response = await apiClient.put(`/workorders/${id}/submissions`, {
		submissions,
	});
	return response.data;
};

export const markWorkOrderReady = async (id: string) => {
	const response = await apiClient.put(`/workorders/${id}/ready`);
	return response.data;
};

export const startWorkOrderApi = async (id: string) => {
	const response = await apiClient.put(`/workorders/${id}/start`);
	return response.data;
};

export const getWorkOrderReport = async (id: string) => {
	const response = await apiClient.get<WorkOrderReportResponse>(
		`/workorders/${id}/report`,
	);
	return response.data;
};

export const submitWorkOrderReportApi = async (
	id: string,
	submissions: {
		formId: string;
		fieldsData: FieldData[];
	}[],
) => {
	const response = await apiClient.put(`/workorders/${id}/report`, {
		submissions,
	});
	return response.data;
};
