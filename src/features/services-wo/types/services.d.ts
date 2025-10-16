// staff
type Staff = {
	position: Position;
	minimumStaff: number;
	maximumStaff: number;
};

// order form service
type OrderForms = {
	order: number;
	formId: Form;
	fillableByRoles: User["role"][];
	viewableByRoles: User["role"][];
	fillableByPositionIds: Position[];
	viewableByPositionIds: Position[];
};

// report forms
type ReportForms = {
	order: number;
	formId: Form;
	fillableByRoles: User["role"][];
	viewableByRoles: User["role"][];
	fillableByPositionIds: Position[];
	viewableByPositionIds: Position[];
};

// services
type Service = {
	_id: string;
	companyId: Company;
	title: string;
	description: string;
	accessType: string;
	isActive: boolean;
	requiredStaff: Staff[];
	workOrderForms: OrderForms[];
	reportForms: ReportForms[];
	createdAt: string;
	updatedAt: string;
};

type GetAllServicesResponse = ApiResponse<Service[]>;

type CreateServiceRequest = {
	tittle: string;
	description: string;
	accessType: string;
	requiredStaff: Staff[];
	workOrderForms: OrderForms[];
	reportForms: ReportForms[];
};
