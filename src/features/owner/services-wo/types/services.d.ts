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
// request service (payload ke backend)
type CreateServiceRequest = {
	title: string;
	description: string;
	accessType: serviceAccessType;
	isActive: boolean;
	// TODO: updated (not review yet)
	drafting_work_order_type: draftingWorkOrderType;
	serviceRequestConfig: {
		intakeFormId: string;
		reviewFormId: string;
		serviceRequestApprovalAccessType: serviceRequestApprovalAccessType;
		reviewNeed: boolean;
	};
	workOrdersConfig: {
		positionId: string;
		workOrderFormId: string | null;
		workReportFormId: string;
		workOrderApprovalAccessType: workOrderApprovalAccessType;
		workReportApprovalAccessType: workReportApprovalAccessType;
		minStaff: number;
		maxStaff: number;
		show_report_to_requester: boolean;
	}[];
};

// response service (response dari backend)
type CreateServiceResponse = ApiResponse<{
	service: Service;
}>;

type GetAllServicesResponse = ApiResponse<Service[]>;

type GetServicesResponseByID = ApiResponse<Service>;
