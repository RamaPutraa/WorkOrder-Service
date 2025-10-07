import api from "@/lib/api";

export const getFormsApi = async () => {
	const response = await api.get<GetFormResponse>("/forms");
	return response.data;
};

export const getFormByIdApi = async (id: string) => {
	const response = await api.get<GetFormByIdResponse>(`/forms/${id}`);
	return response.data;
};

export const createFormApi = async (data: CreateFormRequest) => {
	const response = await api.post<CreateFormResponse>("/forms", data);
	return response.data;
};
