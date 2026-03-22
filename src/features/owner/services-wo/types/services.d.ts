// staff
type Staff = {
	positionId: string;
	minimumStaff: number;
	maximumStaff: number;
};
// TODO: pindah type OrderForms jadi global

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
enum accessTypeService {
	public,
	member_only,
	internal,
}

enum serviceRequestApprovalAccessType {
	auto,
	manager,
}

enum workOrderRequestApprovalAccessType {
	auto,
	staff_pic,
}

enum workReportRequestApprovalAccessType {
	auto,
	manager,
}
// request service (payload ke backend)
type CreateServiceRequest = {
	title: string;
	description: string;
	accessType: accessTypeService;
	isActive: boolean;
	serviceRequestConfig: {
		intakeFormId: string;
		reviewFormId: string;
		serviceRequestApprovalAccessType: serviceRequestApprovalAccessType;
		reviewNeed: boolean;
	};
	workOrdersConfig: {
		positionId: string;
		workOrderFormId: string;
		workReportFormId: string;
		workOrderApprovalAccessType: workOrderRequestApprovalAccessType;
		workReportApprovalAcessType: workReportRequestApprovalAccessType;
		minStaff: number;
		maxStaff: number;
	}[];
};

// response service (response dari backend)
type CreateServiceResponse = ApiResponse<{
	service: Service;
}>;

type GetAllServicesResponse = ApiResponse<Service[]>;

type GetServicesResponseByID = ApiResponse<Service>;
