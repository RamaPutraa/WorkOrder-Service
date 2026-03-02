type GetCompanyProfileResponse = ApiResponse<Company>;

type UpdateCompanyRequest = {
	name: string;
	address: string;
	description: string;
	isActive: boolean;
};

type UpdateCompanyResponse = ApiResponse<Company>;
