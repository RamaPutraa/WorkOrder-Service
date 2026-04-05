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
type RequesterSRResponse = ApiResponse<RequesterSR[]>;

// TODO:ini harusnya global? karna responsenya bakal dipake sipapaun yang SR (client atau staff)
// detail requester
type RequesterSRDetailRequest = {
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
	intakeSubmission: SubmissionObject | null;
	reviewSubmission: SubmissionObject | null;
	createdAt: string;
	updatedAt: string;
};

type RequesterSRDetailResponse = ApiResponse<RequesterSRDetailRequest>;
