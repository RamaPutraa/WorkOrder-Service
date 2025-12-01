import apiClient from "@/lib/api";

export const getInternalCompanyWorkOrders = async () => {
	const response = await apiClient.get<InternalWorkOrderResponse>(
		"/workorders"
	);
	return response.data;
};
