type Position = {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	companyId: string;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

type Employee = {
	_id: string;
	name: string;
	email: string;
	role: string;
	position?: Position;
};

type CompanyEmployeesData = {
	company: {
		_id: string;
		name: string;
	};
	employees: Employee[];
};

type CompanyEmployeesResponse = ApiResponse<Employee[]> & {
	meta: {
		count: number;
	};
};

// TODO: global type
type InvitationsHistory = {
	_id: string;
	role: string;
	status: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	company: CompanyMinimal;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	position: {
		_id: string;
		name: string;
	};
};

type InvitationsHistoryResponse = ApiResponse<{
	invitations: InvitationsHistory[];
}>;

type InvitedItem = {
	user: {
		name: string;
		email: string;
	};
	role_offered: string;
	position_offered: {
		_id: string;
		name: string;
	};
};

type InvitationEmployee = {
	company: CompanyMinimal;
	invited: InvitedItem[];
};

type InviteSingleItem = {
	email: string;
	role: string;
	positionId: string;
};

type InvitationEmployeeRequest = {
	invites: InviteSingleItem[];
};

type InvitationEmployeeResponse = ApiResponse<InvitationEmployee>;
