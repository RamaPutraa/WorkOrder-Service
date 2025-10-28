import apiClient from "@/lib/api";

export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<PublicServiceForm>(
		`/public/services/${id}/intake-forms`
	);
	return response.data;
};
