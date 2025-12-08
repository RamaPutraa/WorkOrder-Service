import apiClient from "@/lib/api";

export const getInternalCompanyWorkOrders = async () => {
	const response = await apiClient.get<InternalWorkOrderResponse>(
		"/workorders"
	);
	return response.data;
};

export const getInternalCompanyWorkOrderDetail = async (id: string) => {
	const response = await apiClient.get<DetailInternalWorkOrderResponse>(
		`/workorders/${id}`
	);
	return response.data;
};
