type Membercode = {
	_id: string;
	company_id: string;
	externalCustomerEmail: string;
	externalCustomerName: string;
	token: string;
};

type getAllMembercodeResponse = ApiResponse<Membercode[]>

type createMemberCodeRequest = {
	file: File;
}
type createMemberCodeResponse = ApiResponse<Membercode[]>;

type claimMembercodeRequest = {
	code: string;
}
type claimMembercodeResponse = ApiResponse<ExternalAccount>;

type deleteMemberCodeResponse = ApiResponse<Membercode>;