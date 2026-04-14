type WorkOrderMeta = {
	workOrderCapabilities: {
		can_start: boolean;
		can_complete: boolean;
		can_fail: boolean;
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
	positionOnDuty: Position;
	minStaff: number;
	maxStaff: number;
	assignedStaff: User[];
	staffPIC: User | null;
	status:
		| "draft"
		| "sent"
		| "approved"
		| "rejected"
		| "cancelled"
		| "unprocessable"
		| "onprogress"
		| "completed"
		| "failed";
	workOrderForm: Form;
	submissions: SubmissionObject[];
	has_issue: boolean;
	issue_note: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
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
	positionOnDuty: Position;
	minStaff: number;
	maxStaff: number;
	assignedStaff: User[];
	staffPIC: User | null;
	status:
		| "draft"
		| "sent"
		| "approved"
		| "rejected"
		| "cancelled"
		| "unprocessable"
		| "onprogress"
		| "completed"
		| "failed";
	workOrderForm: Form;
	submissions: SubmissionObject[];
	has_issue: boolean;
	issue_note: string;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};
type WorkOrderDetailResponse = ApiResponse<
	WorkOrderDetail & { meta: WorkOrderMeta }
>;

type WorkReport = {
	_id: string;
	workOrderId: string;
	reportForm: string;
	workReportApprovalAccessType: "auto" | "manager";
	status:
		| "draft"
		| "sent"
		| "approved"
		| "unprocessable"
		| "onProgress"
		| "failed"
		| "completed";
	approvedBy: User;
	submissions: SubmissionObject[];
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
};
type WorkReportResponse = ApiResponse<WorkReport>;
