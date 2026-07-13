type InvitedHistory = {
	_id: string;
	company: Company;
	role: string;
	position: {
		_id: string;
		name: string;
	};
	status: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

type InvitedHistoryResponse = ApiResponse<InvitedHistory[]>;

type PreviewInvitationCodeData = {
	code: string;
	company: {
		_id: string;
		name: string;
		address?: string;
		description?: string;
	};
	role: string;
	position?: {
		_id: string;
		name: string;
		description?: string;
	};
	expiresAt?: string;
};

type PreviewInvitationCodeResponse = ApiResponse<PreviewInvitationCodeData>;
