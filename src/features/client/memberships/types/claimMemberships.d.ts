type claimMembercodeRequest = {
	code: string;
	company_id: string;
}
type claimMembercodeResponse = ApiResponse<ExternalAccount>;
