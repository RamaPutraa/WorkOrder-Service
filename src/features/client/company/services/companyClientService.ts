import apiClient from "@/lib/api";

export const getAllCompanyApi = async () => {
	const response =
		await apiClient.get<GetAllCompanyResponse>("/public/companies");
	return response.data;
};

export const getCompanyDetailByClientApi = async (companyId: string) => {
	const response = await apiClient.get<GetCompanyDetailByClientResponse>(
		`/public/companies/${companyId}`,
	);
	return response.data;
};

export const getCompanyServiceAPi = async (companyId: string) => {
	const response = await apiClient.get<GetCompanyServiceByClientResponse>(
		`/public/companies/${companyId}/services`,
	);
	return response.data;
};
