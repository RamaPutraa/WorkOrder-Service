import apiClient from "@/lib/api";

export const getAllCompanyApi = async () => {
	const response = await apiClient.get<GetAllCompanyResponse>(
		"/public/companies"
	);
	return response.data;
};

export const getCompanyServiceAPi = async (companyId: string) => {
	const response = await apiClient.get<GetCompanyServiceResponse>(
		`/public/companies/${companyId}/services`
	);
	return response.data;
};
