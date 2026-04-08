type InternalWorkOrder = {
	_id: string;
	code: string;
	serviceRequestId: string | null;
	companyId: CompanyMinimal;
	service: ServiceSummaryObject;
	createdBy: User;
	approvedBy: User;
	workOrderApprovalAccessType: "auto" | "staff_pic";
	minStaff: number;
	maxStaff: number;
	assignedStaff: User[];
	staffPIC: User | null;
	status: "drafted" | "ready" | "inProgress" | "completed" | "cancelled";
	readyAt: string;
	startedAt: string | null;
	completedAt: string | null;
	cancelledAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	workOrderForm: Form;
	submissions: SubmissionObject[];
};
type InternalWorkOrderResponse = ApiResponse<InternalWorkOrder[]>;

type WorkOrderFormItem = {
	order: number;
	form: Form;
	fieldsData?: FieldData[];
};

type DetailInternalWorkOrder = InternalWorkOrder & {
	workorderForms: WorkOrderFormItem[];
	submissions: PublicSubmission[];
};
type DetailInternalWorkOrderResponse = ApiResponse<DetailInternalWorkOrder>;

// wo submit
type AssignStaffToWorkOrder = ApiResponse<StaffItem[]> & {
	meta: {
		count: number;
	};
};

// wo report
type WorkOrderReport = {
	_id: string;
	workOrderId: string;
	companyId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	startedAt: string | null;
	completedAt: string | null;
	reportForms: {
		order: number;
		form: Form;
	}[];
	submissions: PublicSubmission[];
};

type WorkOrderReportResponse = ApiResponse<WorkOrderReport>;
