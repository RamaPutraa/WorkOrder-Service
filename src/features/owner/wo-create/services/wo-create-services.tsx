import apiClient from "@/lib/api";

// create wo
export const createWorkOrderApi = async (id: string) => {
	const response = await apiClient.post<CreateWorkOrderResponse>(
		`/services/${id}/create-work-order`,
	);
	return response.data;
};
