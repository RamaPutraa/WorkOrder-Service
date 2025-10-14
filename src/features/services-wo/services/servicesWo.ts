import apiClient from "@/lib/api";

export const getServicesWoApi = async () => {
	const response = await apiClient.get<GetAllServicesResponse>("/services");
	return response.data;
};
