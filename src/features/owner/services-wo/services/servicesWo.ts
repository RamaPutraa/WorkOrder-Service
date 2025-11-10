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
