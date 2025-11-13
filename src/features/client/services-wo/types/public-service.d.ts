type PublicServiceForm = ApiResponse<
	{
		order: number;
		form: Form;
	}[]
>;

type FieldData = {
	order: number;
	value: string | number;
};

type PublicServiceRequest = {
	formId: string;
	fieldsData: FieldData[];
};

type PublicServiceResponse = ApiResponse<{
	data: ClientRequestService;
}>;

// TODO: konsistenin typenya

// get client service request
type ClientServiceRequest = {
	_id: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
};

type ClientServiceRequestResponse = ApiResponse<ClientServiceRequest[]>;

// detail submissions
type Submission = {
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

type ClientDetailSubmissions = {
	_id: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
	clientIntakeForms: Form[];
	submissions: Submission[];
};

type PublicDetailServiceResponse = ApiResponse<ClientDetailSubmissions>;
