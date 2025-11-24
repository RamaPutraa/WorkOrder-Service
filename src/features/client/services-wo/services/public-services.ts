import apiClient from "@/lib/api";

export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailService>(
		`/public/services/${id}/intake-forms`
	);
	return response.data;
};

export const submitIntakeApi = async (
	id: string,
	data: PublicSubmitRequest[]
) => {
	const response = await apiClient.post<PublicSubmitResponse>(
		`/public/services/${id}/intake-forms`,
		data
	);
	return response.data;
};

export const getAllClientServiceRequestApi = async () => {
	const response = await apiClient.get<PublicServiceRequestResponse>(
		"/public/client-service-request"
	);
	return response.data;
};

export const getDetailClientServiceRequestApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailSubmissionResponse>(
		`/public/client-service-request/${id}`
	);
	return response.data;
};
