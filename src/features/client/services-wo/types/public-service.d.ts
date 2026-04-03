// get detail service company form client
type PublicDetailService = ApiResponse<
	{
		order: number;
		form: Form;
	}[]
>;

// client submit intake form
type FieldData = {
	order: number;
	value: string | number | string[] | File | null;
};
type PublicSubmitRequest = {
	submissions: {
		formId: string;
		fieldsData: FieldData[];
	}[];
};
type PublicSubmitResponse = ApiResponse<{
	data: PublicServiceSubmited;
}>;

// get client service request
type PublicServiceRequest = {
	_id: string;
	serviceRequestStatus:
		| received
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
	intakeSubmission: PublicSubmission;
	reviewSubmission: PublicSubmission;
	createdAt: string;
	updatedAt: string;
};
type PublicServiceRequestResponse = ApiResponse<PublicServiceRequest[]>;

// detail service submissions from client

// TODO: pindah publicsubmission jadi global type
type PublicSubmission = {
	_id: string;
	ownerId: string;
	formId: string;
	submissionType: string;
	fieldsData: FieldData[];
	status: string;
	submittedBy: string;
	createdAt: string;
	updatedAt: string;
};
type ClientIntakeForm = {
	order: number;
	form: Form;
};
type PublicDetailSubmissions = {
	_id: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
	clientIntakeForms: ClientIntakeForm[];
	submissions: PublicSubmission[];
};

type PublicDetailSubmissionResponse = ApiResponse<PublicDetailSubmissions>;
