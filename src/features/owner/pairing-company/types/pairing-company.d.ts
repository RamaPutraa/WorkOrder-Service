type getIntegrationConfigResponse = ApiResponse<IntegrationConfig>;

type GetAllMember = {
	user: User;
	external_account: ExternalAccount;
	integrationType: "external_system" | "claim_token";
};
type getAllMembershipResponse = ApiResponse<GetAllMember[]>;
