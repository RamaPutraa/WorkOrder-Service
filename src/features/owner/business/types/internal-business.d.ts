// internal service request type
type InternalServiceRequest = {
	_id: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	companyId: string;
	client: User;
	service: Service;
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
	status: string;
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
