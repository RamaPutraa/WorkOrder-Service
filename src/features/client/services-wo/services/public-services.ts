import apiClient from "@/lib/api";
import { dummyPublicServiceRequests } from "../mocks/public-service-request.mock";

const USE_MOCK = true; // TODO: Ubah ke false jika API backend sudah siap

export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailService>(
		`/public/services/${id}/intake-forms`,
	);
	return response.data;
};

export const submitIntakeApi = async (
	id: string,
	data: PublicSubmitRequest,
) => {
	const response = await apiClient.post<PublicSubmitResponse>(
		`/public/services/${id}/intake-forms`,
		data,
	);
	return response.data;
};

export const getAllClientServiceRequestApi = async () => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyPublicServiceRequests,
			message: "Success (Mock)",
			status: 200,
		} as PublicServiceRequestResponse;
	}

	const response = await apiClient.get<PublicServiceRequestResponse>(
		"/public/client-service-request",
	);
	return response.data;
};

export const getDetailClientServiceRequestApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailSubmissionResponse>(
		`/public/client-service-request/${id}`,
	);
	return response.data;
};
