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

type deleteMemberCodeResponse = ApiResponse<Membercode>;