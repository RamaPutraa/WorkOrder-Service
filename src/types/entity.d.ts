// users
type User = {
	_id: number;
	name: string;
	email: string;
	role: string;
	position: Position;
	company: CompanyMinimal;
};

// companies
type CompanyMinimal = {
	_id: number;
	name: string;
};

type Company = CompanyMinimal & {
	ownerId: number;
	address: string;
	description: string;
	isActive: boolean;
	createAt: string;
};

// potisions
type Position = {
	_id: number;
	name: string;
	companyId: number;
	createAt: string;
	updateAt: string;
};

// forms
type Form = {
	_id: string;
	title: string;
	description: string;
	formType: string;
	fields: Field[];
};
