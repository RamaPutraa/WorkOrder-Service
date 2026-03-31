type Membercode = {
	_id: string;
	code: string;
	isClaimed: boolean;
	claimedBy: {
		_id: string;
		name: string;
		email: string;
		role: string;
	} | null;
	companyId: string;
	claimedAt: string | null;
	deletedAt: string | null;
	__v: number;
	createdAt: string;
	updatedAt: string;
};

type GetMembercodesResponse = ApiResponse<Membercode[]>;

type CreateMembercodeRequest = {
	amount: number;
	prefix: string;
};

type CreateMembercodesResponse = ApiResponse<Membercode[]>;
