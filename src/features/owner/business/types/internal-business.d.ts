// get service-request (inbox)
type InboxSRResponse = ApiResponse<InboxSR[]>;

type InboxSRDetailRequest = {
	_id: string;
	servicesRequestStatus:
		| "received"
		| "cancelled"
		| "rejected"
		| "approved"
		| "workOrderCreated"
		| "completed"
		| "closed";
	serviceRequestApprovalAccessType: "auto" | "manager";
	reviewNeed: boolean;
	service: ServiceSummaryObject;
	requestedBy: User;
	approvedBy: User;
	intakeForm: Form;
	reviewForm: Form;
	intakeSubmission: SubmissionObject;
	reviewSubmission: SubmissionObject;
	createdAt: string;
	updatedAt: string;
};

// get detail internal service request
type InboxSRDetailResponse = ApiResponse<InboxSRDetailRequest>;

// createdAt: string;
// updatedAt: string;
// companyId: string;
// client: User;
// service: Service;
// clientIntakeForms: ClientIntakeForm[];
// submissions: SubmissionObject[];
