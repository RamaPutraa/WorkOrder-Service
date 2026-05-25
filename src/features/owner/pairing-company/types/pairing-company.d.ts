type getIntegrationConfigResponse = ApiResponse<IntegrationConfig>;

type GetAllMember = {
	user: User;
	externalAccount: ExternalAccount;
	integrationType: "external_system" | "claim_token";
};
type getAllMembershipResponse = ApiResponse<GetAllMember[]>;
