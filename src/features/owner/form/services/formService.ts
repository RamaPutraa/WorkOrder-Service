// import api from "@/lib/api";
import apiCLient from "@/lib/api";

export const getFormsApi = async () => {
	const response = await apiCLient.get<FormResponse>("/forms");
	return response.data;
};

export const getFormByIdApi = async (id: string) => {
	const response = await apiCLient.get<GetFormByIdResponse>(`/forms/${id}`);
	return response.data;
};

export const createFormApi = async (data: CreateFormRequest) => {
	const response = await apiCLient.post<FormResponse>("/forms", data);
	return response.data;
};

export const getPositions = async (): Promise<GetAllPosition> => {
	const response = await apiCLient.get<GetAllPosition>("/positions");
	return response.data;
};
