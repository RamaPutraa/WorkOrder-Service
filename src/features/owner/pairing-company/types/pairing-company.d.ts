type getIntegrationConfigResponse = ApiResponse<IntegrationConfig>;

type GetAllMember = {
	User: User;
	external_account: ExternalAccount;
};
type getAllMembershipResponse = ApiResponse<GetAllMember>;
