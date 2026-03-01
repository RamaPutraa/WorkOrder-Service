import apiClient from "@/lib/api";

export const getCompanyProfileApi = async () => {
	const response = await apiClient.get<GetCompanyProfileResponse>("/company");
	return response.data;
};

export const updateCompanyApi = async (
	data: UpdateCompanyRequest,
	id: string,
) => {
	const response = await apiClient.put<UpdateCompanyResponse>(
		`/company/${id}`,
		data,
	);
	return response.data;
};
