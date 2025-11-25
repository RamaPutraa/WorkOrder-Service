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
	value: string | number | string[] | File;
};
type PublicSubmitRequest = {
	formId: string;
	fieldsData: FieldData[];
};
type PublicSubmitResponse = ApiResponse<{
	data: PublicServiceSubmited;
}>;

// get client service request
type PublicServiceRequest = {
	_id: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
};
type PublicServiceRequestResponse = ApiResponse<PublicServiceRequest[]>;

// detail service submissions from client
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
