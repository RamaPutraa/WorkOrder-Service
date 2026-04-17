// inbox service request type (only owner/manager)
type ServiceSummaryObject = {
	_id: string;
	title: string;
	description: string;
	accessType: "public" | "member_only" | "internal";
	isActive: boolean;
};

type SubmissionObject = {
	_id: string;
	ownerId: string;
	formId: string;
	submissionType: string;
	fieldsData: FieldData[]; // from types/public-service.d.ts
	status: string;
	submittedBy: string;
	createdAt: string;
	updatedAt: string;
};

// internal get service request
type InboxSR = {
	_id: string;
	code: string;
	// TODO: bisa revisi statusnya
	serviceRequestStatus:
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
	reviewSubmission: SubmissionObject | null;
	createdAt: string;
	updatedAt: string;
};
type InboxSRResponse = ApiResponse<InboxSR[]>;

// get detail internal service request
type InboxSRDetailRequest = {
	_id: string;
	code: string;
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
type InboxSRDetailResponse = ApiResponse<InboxSRDetailRequest>;

// client service request type
type RequesterSR = {
	_id: string;
	code: string;
	serviceRequestStatus:
		| "received"
		| "cancelled"
		| "rejected"
		| "approved"
		| "workOrderCreated"
		| "onprogress"
		| "completed"
		| "closed"
		| "failed"
		| "unprocessable";
	company: Company;
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
type RequesterSRResponse = ApiResponse<RequesterSR[]>;

// detail requester
type RequesterSRDetailRequest = {
	_id: string;
	code: string;
	serviceRequestStatus:
		| "received"
		| "cancelled"
		| "rejected"
		| "approved"
		| "workOrderCreated"
		| "onprogress"
		| "completed"
		| "closed"
		| "failed"
		| "unprocessable";
	company: Company;
	service: ServiceSummaryObject;
	requestedBy: User;
	approvedBy: User;
	intakeForm: Form;
	reviewForm: Form;
	intakeSubmission: SubmissionObject | null;
	reviewSubmission: SubmissionObject | null;
	createdAt: string;
	updatedAt: string;
};
type RequesterSRDetailResponse = ApiResponse<RequesterSRDetailRequest>;

// requestr get sr intake
type RequesterSRIntakeFormResponse = ApiResponse<Form>;

// requsetr submit sr intake
type RequesterSubmitRequest = {
	submission: {
		formId: string;
		fieldsData: FieldData[];
	};
};

// requester submit sr intake response
type RequesterSubmitResponse = ApiResponse<{
	data: RequesterSR;
}>;
