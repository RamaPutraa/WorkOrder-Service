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
};

// response service (response dari backend)
type CreateServiceResponse = ApiResponse<{
	service: Service;
}>;

type GetAllServicesResponse = ApiResponse<Service[]>;

// ==========================
// === FULL SERVICE ENTITY ===
// ==========================-

type Service = {
	_id: string;
	companyId: string;
	title: string;
	description: string;
	accessType: string;
	isActive: boolean;

	requiredStaff: {
		position: {
			_id: string;
			name: string;
		};
		minimumStaff: number;
		maximumStaff: number;
	}[];

	workOrderForms: {
		order: number;
		fillableByRoles: string[];
		viewableByRoles: string[];
		fillableByPositions: {
			_id: string;
			name: string;
		}[];
		viewableByPositions: {
			_id: string;
			name: string;
		}[];
		form: Form;
	}[];

	reportForms: {
		order: number;
		fillableByRoles: string[];
		viewableByRoles: string[];
		fillableByPositions: {
			_id: string;
			name: string;
		}[];
		viewableByPositions: {
			_id: string;
			name: string;
		}[];
		form: Form;
	}[];

	createdAt: string;
	updatedAt: string;
};
