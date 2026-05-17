type IntegrationConfig = {
	external_login_url: string;
	external_verify_url: string;
	external_check_memberships_url: string;
	secret_key: string;
	is_integration_active: boolean;
};

type ExternalAccount = {
	_id: string;
	external_customer_email: string;
	external_customer_name: string;
	company: Company;
	paired_at: Date;
};
