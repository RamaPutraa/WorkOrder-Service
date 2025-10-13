import api from "@/lib/api";
import type { GetPositionsResponse } from "@/types/position";

// export const getFormsApi = async () => {
// 	const response = await api.get<GetFormResponse>("/forms");
// 	return response.data;
// };

// export const getFormByIdApi = async (id: string) => {
// 	const response = await api.get<GetFormByIdResponse>(`/forms/${id}`);
// 	return response.data;
// };

export const createFormApi = async (data: CreateFormRequest) => {
	const response = await api.post<FormResponse>("/forms", data);
	return response.data;
};

export const getPositions = async (): Promise<GetPositionsResponse> => {
	const response = await api.get<GetPositionsResponse>("/positions");
	return response.data;
};

// Dummy untuk akses user
export const getAccessTypes = async () => {
	return [
		{ key: "manager", name: "Manager" },
		{ key: "staff", name: "Staff" },
	];
};
