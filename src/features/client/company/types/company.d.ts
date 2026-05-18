type GetAllCompanyResponse = ApiResponse<Company[]>;

// get company detail by client
type MetaDetailCompany = {
	isSubscribed: boolean;
	isIntegrationActive: boolean;
};
type CompanyDetailClient = {
	_id: string;
	name: string;
	address: string;
	description: string;
	ownerId: string;
	meta: MetaDetailCompany;
};
type GetCompanyDetailByClientResponse = ApiResponse<CompanyDetailClient>;

// get compant service by client
type GetServiceByClient = {
	_id: string;
	companyId: string;
	title: string;
	description: string;
	accessType: string;
	isActive: boolean;
};
type GetCompanyServiceByClient = {
	services: GetServiceByClient[];
};
type GetCompanyServiceByClientResponse = ApiResponse<GetServiceByClient[]>;
