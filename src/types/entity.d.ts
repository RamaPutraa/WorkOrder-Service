// users
type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	company?: Company;
	position?: Position;
};

// potisions
type Position = {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	companyId: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

// staff item
type StaffItem = {
	_id: string;
	name: string;
	email: string;
	role: string;
	position: Position;
};

// employees
type EmployeeGroup = {
	company: CompanyMinimal;
	employees: StaffItem[];
};

// forms
type Form = {
	_id: string;
	title: string;
	description: string;
	formType: string;
	fields: Field[];
	createdAt: string;
	updatedAt: string;
};

// Companies
type CompanyMinimal = {
	_id: string;
	name: string;
};
type Company = CompanyMinimal & {
	address: string;
	description: string;
	managers: User[];
	staffs: User[];
	isActive: boolean;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	owner: {
		_id: string;
		name: string;
		email: string;
	};
};

// Services
enum serviceAccessType {
	public = "public",
	member_only = "member_only",
	internal = "internal",
}

enum serviceRequestApprovalAccessType {
	auto,
	manager,
}

enum workOrderApprovalAccessType {
	auto,
	staff_pic,
}

enum workReportApprovalAccessType {
	auto,
	manager,
}

type Service = {
	_id: string;
	serviceKey: string;
	companyId: string;
	title: string;
	description: string;
	accessType: serviceAccessType;
	isActive: boolean;
	serviceRequestConfig: {
		intakeForm: Form;
		reviewForm: Form;
		serviceRequestApprovalAccessType: serviceRequestApprovalAccessType;
		reviewNeed: boolean;
	};

	workOrdersConfig: [
		{
			workOrderForm: Form;
			workReportForm: Form;
			positionsOnDuty: Position;
			workOrderApprovalAccessType: workOrderApprovalAccessType;
			workReportApprovalAccessType: workReportApprovalAccessType;
			minStaff: number;
			maxStaff: number;
		},
	];
	createdAt: string;
	updatedAt: string;
};

//client submit service
type ClientIntakeForm = {
	order: number;
	form: Form;
};
type PublicServiceSubmited = {
	_id: string;
	serviceId: string;
	clientId: string;
	clientIntakeForm: ClientIntakeForm[];
	status: string;
	companyId: string;
	createdAt: string;
	updatedAt: string;
};
