import apiClient from "@/lib/api";

export const getAllEmployeeApi = async () => {
	const response = await apiClient.get<GetAllEmployeeResponse>(
		"/companies/employees"
	);
	return response.data;
};
