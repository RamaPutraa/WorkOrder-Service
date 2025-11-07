// staff
type Staff = {
	positionId: string;
	minimumStaff: number;
	maximumStaff: number;
};

// order form service
type OrderForms = {
	order: number;
	formId: string;
	fillableByRoles: string[];
	viewableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByPositionIds: string[];
};

// report forms
type ReportForms = {
	order: number;
	formId: string;
	fillableByRoles: string[];
	viewableByRoles: string[];
	fillableByPositionIds: string[];
	viewableByPositionIds: string[];
};

type IntakeForms = {
	order: number;
	formId: string;
};

// ==========================
// === REQUEST & RESPONSE ===
// ==========================

// request service (payload ke backend)
type CreateServiceRequest = {
	title: string;
	description: string;
	isActive: boolean;
	accessType: string;
	requiredStaff: Staff[];
	workOrderForms: OrderForms[];
	reportForms: ReportForms[];
	clientIntakeForms: IntakeForms[];
};

// response service (response dari backend)
type CreateServiceResponse = ApiResponse<{
	service: Service;
}>;

type GetAllServicesResponse = ApiResponse<Service[]>;
