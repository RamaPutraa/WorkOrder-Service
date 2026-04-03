// internal service request type
type ServiceSummaryObject = {
	_id: string;
	title: string;
	description: string;
	accessType: "public" | "member_only" | "internal";
	isActive: boolean;
};

type InternalServiceRequest = {
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
	intakeSubmission: InternalSubmission;
	reviewSubmission: InternalSubmission;
	createdAt: string;
	updatedAt: string;
};
type InternalServiceRequestResponse = ApiResponse<InternalServiceRequest[]>;

// get internal service detail request
type InternalSubmission = {
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
type InternalServiceDetailRequest = {
	_id: string;
	servicesRequestStatus: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
	clientIntakeForms: ClientIntakeForm[]; // from types/public-service.d.ts
	submissions: InternalSubmission[];
};

// get detail internal service request
type InternalServiceDetailRequestResponse =
	ApiResponse<InternalServiceDetailRequest>;
