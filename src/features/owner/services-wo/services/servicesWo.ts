import apiClient from "@/lib/api";

export const getServicesWoApi = async () => {
	const response = await apiClient.get<GetAllServicesResponse>("/services");
	return response.data;
};

export const getServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<GetServicesResponseByID>(
		`/services/${id}`
	);
	return response.data;
};

export const createServiceApi = async (data: CreateServiceRequest) => {
	const response = await apiClient.post<CreateServiceResponse>(
		"/services",
		data
	);
	return response.data;
};

export const updateServiceApi = async (id: string, data: CreateServiceRequest) => {
	const response = await apiClient.put<CreateServiceResponse>(
		`/services/${id}`,
		data
	);
	return response.data;
};

export const toggleServiceActiveApi = async (id: string, request?: any) => {
	const response = await apiClient.patch<GetServicesResponseByID>(
		`/services/${id}/toggle-active`,
		request
	);
	return response.data;
};

export const deleteServiceApi = async (id: string) => {
	const response = await apiClient.delete(`/services/${id}`);
	return response.data;
};
