import apiClient from "@/lib/api";

export const getCompanyProfileApi = async () => {
	const response = await apiClient.get<GetCompanyProfileResponse>("/company");
	return response.data;
};

export const getCompanyByIdApi = async (id: string) => {
	const response = await apiClient.get<GetCompanyProfileResponse>(
		`/company/${id}`,
	);
	return response.data;
};

export const updateCompanyApi = async (data: UpdateCompanyRequest) => {
	const response = await apiClient.put<UpdateCompanyResponse>(`/company`, data);
	return response.data;
};
