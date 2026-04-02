type ClaimMembershipsRequest = {
	code: string;
};

type ClaimMembershipsResponse = {
	_id: string;
	code: string;
	isClaimed: boolean;
	claimedBy: User;
	claimedAt: string;
	deletedAt: string;
	__v: number;
	createdAt: string;
	updatedAt: string;
	company: {
		_id: string;
		name: string;
		address: string;
	};
};

type CreateMembershipClaimResponse = ApiResponse<ClaimMembershipsResponse>;
