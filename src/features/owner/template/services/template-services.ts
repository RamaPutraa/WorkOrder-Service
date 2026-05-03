import apiClient from "@/lib/api";

// get company template type
export const getCompanyTypeApi = async () => {
	const response = await apiClient.get<GetAllCompanyTypeResponse>(
		"/template/company-type",
	);
	return response.data;
};

// get service template
export const getServiceTemplateApi = async (id: string) => {
	const response = await apiClient.get<GetAllServiceTemplateResponse>(
		`/template/company-type/${id}/services`,
	);
	return response.data;
};

//  get service template preview
export const getServiceTemplatePreviewApi = async (id: string) => {
	const response = await apiClient.get<ServiceTemplatePreviewResponse>(
		`/template/service/${id}`,
	);
	return response.data;
};

// generate service by template
export const generateServiceByTemplateApi = async (
	data: CreateServiceByTemplateRequest,
) => {
	const response = await apiClient.post<CreateServiceByTemplateResponse>(
		"/template/services/generate-service-by-template",
		data,
	);
	return response.data;
};
