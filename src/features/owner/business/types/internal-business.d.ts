// get service-request (inbox)
type InboxServiceRequestResponse = ApiResponse<InboxServiceRequest[]>;

type InboxServiceDetailRequest = {
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

// createdAt: string;
// updatedAt: string;
// companyId: string;
// client: User;
// service: Service;
// clientIntakeForms: ClientIntakeForm[];
// submissions: SubmissionObject[];

// get detail internal service request
type InboxServiceDetailRequestResponse = ApiResponse<InboxServiceDetailRequest>;
