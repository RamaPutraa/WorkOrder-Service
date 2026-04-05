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

// detail service submissions from client

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
	submissions: SubmissionObject[];
};

type PublicDetailSubmissionResponse = ApiResponse<PublicDetailSubmissions>;
