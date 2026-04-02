type GetAllCompanyResponse = ApiResponse<Company[]>;

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
	isSubscribed: boolean;
	services: GetServiceByClient[];
};
type GetCompanyServiceByClientResponse = ApiResponse<GetCompanyServiceByClient>;
