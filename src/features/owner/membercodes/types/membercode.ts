export type Membercode = {
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

export type GetMembercodesResponse = ApiResponse<Membercode[]>;

export type CreateMembercodeRequest = {
	amount: number;
	prefix: string;
};

export type CreateMembercodesResponse = ApiResponse<Membercode[]>;