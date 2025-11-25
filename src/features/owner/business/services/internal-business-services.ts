import apiClient from "@/lib/api";

export const getAllInternalBusinessServiceRequestApi = async () => {
	const response = await apiClient.get<InternalServiceRequestResponse>(
		"/client-service-request"
	);
	return response.data;
};
