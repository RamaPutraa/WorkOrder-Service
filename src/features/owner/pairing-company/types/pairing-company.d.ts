type getIntegrationConfigResponse = ApiResponse<IntegrationConfig>;

type GetAllMember = {
	user: User;
	externalAccount: ExternalAccount;
};
type getAllMembershipResponse = ApiResponse<GetAllMember[]>;
