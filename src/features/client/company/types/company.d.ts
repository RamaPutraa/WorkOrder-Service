type GetAllCompanyResponse = ApiResponse<Company[]>;

// get company detail by client
type MetaDetailCompany = {
	isSubscribed: boolean;
	isIntegrationActive: boolean;
	integrationType: "external_system" | "claim_token";
};
type CompanyDetailClient = {
	_id: string;
	name: string;
	address: string;
	description: string;
	ownerId: string;
	isFaqActive: boolean;
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
	price: number;
};
type GetCompanyServiceByClient = {
	services: GetServiceByClient[];
};
type GetCompanyServiceByClientResponse = ApiResponse<GetServiceByClient[]>;
