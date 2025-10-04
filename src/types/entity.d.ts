// users
export type User = {
	_id: number;
	name: string;
	email: string;
	role: string;
	company: CompanyMinimal;
};

// companies
export type CompanyMinimal = {
	_id: number;
	name: string;
};

export type Company = CompanyMinimal & {
	ownerId: number;
	address: string;
	description: string;
	isActive: boolean;
	createAt: string;
};
