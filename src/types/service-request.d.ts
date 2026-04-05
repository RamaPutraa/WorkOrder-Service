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

type InboxSR = {
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
	reviewSubmission: SubmissionObject | null;
	createdAt: string;
	updatedAt: string;
};

// client service request type
type RequesterSR = {
	_id: string;
	serviceRequestStatus:
		| "received"
		| "cancelled"
		| "rejected"
		| "approved"
		| "workOrderCreated"
		| "completed"
		| "closed";
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
