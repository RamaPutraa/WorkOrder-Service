import apiClient from "@/lib/api";

export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<RequesterSRIntakeFormResponse>(
		`/public/services/${id}/intake-form`,
	);
	return response.data;
};

export const submitIntakeApi = async (
	id: string,
	data: RequesterSubmitRequest,
) => {
	const response = await apiClient.post<RequesterSubmitResponse>(
		`/service-requests/service/${id}`,
		data,
	);
	return response.data;
};

export const getAllClientServiceRequestApi = async () => {
	const response = await apiClient.get<RequesterSRResponse>(
		"/service-requests/sent",
	);
	return response.data;
};

export const getDetailClientServiceRequestApi = async (id: string) => {
	const response = await apiClient.get<RequesterSRDetailResponse>(
		`/service-requests/${id}`,
	);
	return response.data;
};

export const submitReviewApi = async (
	id: string,
	data: RequesterSubmitRequest,
) => {
	const response = await apiClient.post<RequesterSubmitResponse>(
		`/service-requests/${id}/review`,
		data,
	);
	return response.data;
};
