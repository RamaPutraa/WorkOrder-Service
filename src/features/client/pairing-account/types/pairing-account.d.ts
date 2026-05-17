type StartPairingRequest = {
	redirect_base_url: string;
	company_id: string;
};

type StartPairingResponse = {
	redirect_url: string;
};
type getStartPairingResponse = ApiResponse<StartPairingResponse>;

type CompletePairingRequest = {
	company_id: string;
	code: string;
	state: string;
};
type getCompletePairingResponse = ApiResponse<ExternalAccount>;

type getAllPairedAccountResponse = ApiResponse<ExternalAccount[]>;

type getPairedAccountInCompanyResponse = ApiResponse<ExternalAccount>;

type detachPairedAccountResponse = ApiResponse<ExternalAccount>;
