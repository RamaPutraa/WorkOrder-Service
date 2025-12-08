import apiClient from "@/lib/api";

export const getAllInternalBusinessServiceRequestApi = async () => {
	const response = await apiClient.get<InternalServiceRequestResponse>(
		"/client-service-request"
	);
	return response.data;
};

export const getDetailInternalBusinessServiceRequestApi = async (
	id: string
) => {
	const response = await apiClient.get<InternalServiceDetailRequestResponse>(
		`/client-service-request/${id}`
	);
	return response.data;
};

export const rejectInternalBusinessServiceRequestApi = async (id: string) => {
	const response = await apiClient.put(`/client-service-request/${id}/reject`);
	return response.data;
};

export const approveInternalBusinessServiceRequestApi = async (id: string) => {
	const response = await apiClient.put(`/client-service-request/${id}/approve`);
	return response.data;
};
