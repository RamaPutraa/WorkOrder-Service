type IntegrationConfig = {
	external_login_url: string;
	external_verify_url: string;
	external_check_memberships_url: string;
	secret_key: string;
	is_integration_active: boolean;
	integration_type: "external_system" | "claim_token";
};

type ExternalAccount = {
	_id: string;
	externalCustomerEmail: string;
	externalCustomerName: string;
	company: Company;
	pairedAt: Date;
};
