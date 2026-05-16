import apiClient from "@/lib/api";

export const getIntegrationConfig = async () => {
	const response = await apiClient.get<getIntegrationConfigResponse>(
		"/company/integration-config",
	);
	return response.data;
};

export const updateCompanyIntegration = async (data: IntegrationConfig) => {
	const response = await apiClient.put<getIntegrationConfigResponse>(
		"/company/integration-config",
		data,
	);
	return response.data;
};

// TODO : show ini di ui belum
export const getAllMembership = async () => {
	const response = await apiClient.get<getAllMembershipResponse>("/membership");
	return response.data;
};
