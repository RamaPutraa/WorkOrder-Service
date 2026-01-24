import apiClient from "@/lib/api";

export const getCompanyEmployees = async () => {
	const response =
		await apiClient.get<CompanyEmployeesResponse>("/company/employees");
	return response.data;
};
