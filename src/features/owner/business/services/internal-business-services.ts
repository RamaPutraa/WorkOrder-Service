import apiClient from "@/lib/api";
import { dummyInternalServiceRequests } from "../mock/internal-service-request.mock";

const USE_MOCK = true; // TODO: Ubah ke false jika API backend sudah siap

export const getAllInternalBusinessServiceRequestApi = async () => {
	if (USE_MOCK) {
		// Simulasi delay network 500ms
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyInternalServiceRequests,
			message: "Success (Mock)",
			status: 200,
		} as InternalServiceRequestResponse;
	}

	const response = await apiClient.get<InternalServiceRequestResponse>(
		"/client-service-request",
	);
	return response.data;
};

export const getDetailInternalBusinessServiceRequestApi = async (
	id: string,
) => {
	const response = await apiClient.get<InternalServiceDetailRequestResponse>(
		`/client-service-request/${id}`,
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
