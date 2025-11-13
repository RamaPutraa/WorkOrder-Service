import apiClient from "@/lib/api";

export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<PublicServiceForm>(
		`/public/services/${id}/intake-forms`
	);
	return response.data;
};

export const submitIntakeApi = async (
	id: string,
	data: PublicServiceRequest[]
) => {
	const response = await apiClient.post<PublicServiceResponse>(
		`/public/services/${id}/intake-forms`,
		data
	);
	return response.data;
};

export const getAllClientServiceRequestApi = async () => {
	const response = await apiClient.get<ClientServiceRequestResponse>(
		"/public/client-service-request"
	);
	return response.data;
};

export const getDetailClientServiceRequestApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailServiceResponse>(
		`/public/client-service-request/${id}`
	);
	return response.data;
};
