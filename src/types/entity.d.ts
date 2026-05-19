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
	formType: "work_order" | "intake" | "review" | "report";
	fields: Field[];
	createdAt: string;
	updatedAt: string;
	position: Position | null;
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
type serviceAccessType = "public" | "member_only" | "internal";

type serviceRequestApprovalAccessType = "auto" | "manager";

type workOrderApprovalAccessType = "auto" | "staff_pic";

type workReportApprovalAccessType = "auto" | "manager";

type draftingWorkOrderType = "auto" | "manual";

// TODO: updated (not review yet)
type Service = {
	_id: string;
	serviceKey: string;
	companyId: string;
	title: string;
	description: string;
	accessType: serviceAccessType;
	isActive: boolean;
	draftingWorkOrderType: draftingWorkOrderType;
	serviceRequestConfig: {
		intakeForm: Form;
		reviewForm: Form;
		serviceRequestApprovalAccessType: serviceRequestApprovalAccessType;
		reviewNeed: boolean;
	};

	workOrdersConfig: {
		_id: string;
		workOrderForm: Form | null;
		workReportForm: Form;
		positionsOnDuty: Position;
		workOrderApprovalAccessType: workOrderApprovalAccessType;
		workReportApprovalAccessType: workReportApprovalAccessType;
		minStaff: number;
		maxStaff: number;
		showReportToRequester: boolean;
	}[];
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
