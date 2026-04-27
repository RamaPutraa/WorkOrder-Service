type WorkOrderMeta = {
	workOrderCapabilities: {
		can_start: boolean;
		can_complete: boolean;
		can_fail: boolean;
		can_recreate: boolean;
		can_cancel: boolean;
	};
	workOrderSiblings: {
		_id: string;
		code: string;
		status: string;
	}[];
};

type WorkOrder = {
	_id: string;
	code: string;
	serviceRequestId: string;
	configId: string;
	service: ServiceSummaryObject;
	createdBy: User;
	approvedBy: User;
	workOrderApprovalAccessType: "auto" | "staff_pic";
	positionsOnDuty: Position;
	minStaff: number;
	maxStaff: number;
	assignedStaff: User[];
	staffPIC: User | null;
	status:
		| "drafted"
		| "sent"
		| "approved"
		| "rejected"
		| "cancelled"
		| "unprocessable"
		| "on_progress"
		| "completed"
		| "failed";
	workOrderForm: Form;
	submissions: SubmissionObject[];
	has_issue: boolean;
	issue_note: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	approvedAt: string | null;
	cancelledAt: string | null;
	rejectedAt: string | null;
	unprocessableAt: string | null;

	completedAt: string | null;
	failedAt: string | null;
	draftedAt: string | null;
	sentAt: string | null;
	startedAt: string | null;
};
type WorkOrderResponse = ApiResponse<WorkOrder>;

type WorkOrderDetail = {
	_id: string;
	code: string;
	serviceRequestId: string;
	configId: string;
	service: ServiceSummaryObject;
	createdBy: User;
	approvedBy: User;
	workOrderApprovalAccessType: "auto" | "staff_pic";
	positionsOnDuty: Position;
	minStaff: number;
	maxStaff: number;
	assignedStaff: User[];
	staffPIC: User | null;
	status:
		| "drafted"
		| "sent"
		| "approved"
		| "rejected"
		| "cancelled"
		| "unprocessable"
		| "on_progress"
		| "completed"
		| "failed";
	workOrderForm: Form;
	submissions: SubmissionObject[];
	has_issue: boolean;
	issue_note: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	approvedAt: string | null;
	cancelledAt: string | null;
	rejectedAt: string | null;
	unprocessableAt: string | null;

	completedAt: string | null;
	failedAt: string | null;
	draftedAt: string | null;
	sentAt: string | null;
	startedAt: string | null;
	meta?: WorkOrderMeta;
};
type WorkOrderDetailResponse = ApiResponse<WorkOrderDetail>;

type WorkReport = {
	_id: string;
	workOrderId: string;
	reportForm: string;
	workReportApprovalAccessType: "auto" | "manager";
	status: "on_progress" | "submitted" | "rejected" | "approved";
	approvedBy: User | null;
	submissions: SubmissionObject[];
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};
type WorkReportResponse = ApiResponse<WorkReport>;
