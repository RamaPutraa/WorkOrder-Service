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

// get requester service request
type RequesterServiceRequestResponse = ApiResponse<RequesterServiceRequest[]>;

// TODO:ini harusnya global? karna responsenya bakal dipake sipapaun yang SR (client atau staff)
// detail requester
type RequesterServiceDetailRequest = {
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
	reviewSubmission: SubmissionObject | null;
	createdAt: string;
	updatedAt: string;
};

type RequesterServiceDetailRequestResponse =
	ApiResponse<RequesterServiceDetailRequest>;
