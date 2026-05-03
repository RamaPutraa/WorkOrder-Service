// get company template
type CompanyType = {
	_id: string;
	companyTypeName: string;
};
type GetAllCompanyTypeResponse = ApiResponse<CompanyType>;

// get service template
type ServiceTemplate = {
	_id: string;
	title: string;
	description: string;
};
type GetAllServiceTemplateResponse = ApiResponse<ServiceTemplate>;

// get service template preview
type ServiceTemplatePreview = {
	_id: string;
	service: Service;
	positionRequired: Position[];
};
type ServiceTemplatePreviewResponse = ApiResponse<ServiceTemplatePreview>;

// generate template
type CreateServiceByTemplate = {
	serviceTemplateIds: string[];
};
// request body
type CreateServiceByTemplateRequest = ApiResponse<CreateServiceByTemplate>;
// response
type CreateServiceByTemplateResponse = ApiResponse<ServiceSummaryObject[]>;
