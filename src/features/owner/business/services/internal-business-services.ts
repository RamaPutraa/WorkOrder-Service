import apiClient from "@/lib/api";
import {
	dummyInternalServiceRequests,
	dummyInternalServiceDetailRequest,
} from "../mock/internal-service-request.mock";

const USE_MOCK = true; // TODO: Ubah ke false jika API backend sudah siap

export const getAllInternalBusinessServiceRequestApi = async () => {
	if (USE_MOCK) {
		// Simulasi delay network 500ms
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyInternalServiceRequests,
			message: "Success (Mock)",
			status: 200,
		} as InboxSRResponse;
	}

	const response = await apiClient.get<InboxSRResponse>(
		"/service-request/inbox",
	);
	return response.data;
};

export const getDetailInternalBusinessServiceRequestApi = async (
	id: string,
) => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const mockData =
			(dummyInternalServiceRequests.find(
				(req) => req._id === id,
			) as unknown as InboxSRDetailRequest) ||
			dummyInternalServiceDetailRequest;

		return {
			data: mockData,
			message: "Success (Mock)",
			status: 200,
		} as InboxSRDetailResponse;
	}

	const response = await apiClient.get<InboxSRDetailResponse>(
		`/service-requests/${id}`,
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
