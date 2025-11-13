// users
type User = {
	_id: number;
	name: string;
	email: string;
	role: string;
	position: Position;
	company: CompanyMinimal;
};

// potisions
type Position = {
	_id: string;
	name: string;
	companyId: number;
	createAt: string;
	updateAt: string;
};

// forms
type Form = {
	_id: string;
	title: string;
	description: string;
	formType: string;
	fields: Field[];
};

// Companies
type CompanyMinimal = {
	_id: number;
	name: string;
};
type Company = CompanyMinimal & {
	ownerId: number;
	address: string;
	description: string;
	isActive: boolean;
	createAt: string;
};

// Services
type Service = {
	_id: string;
	companyId: string;
	title: string;
	description: string;
	accessType: string;
	isActive: boolean;

	requiredStaff: {
		position: {
			_id: string;
			name: string;
		};
		minimumStaff: number;
		maximumStaff: number;
	}[];

	workOrderForms: {
		order: number;
		fillableByRoles: string[];
		viewableByRoles: string[];
		fillableByPositions: {
			_id: string;
			name: string;
		}[];
		viewableByPositions: {
			_id: string;
			name: string;
		}[];
		form: Form;
	}[];

	reportForms: {
		order: number;
		fillableByRoles: string[];
		viewableByRoles: string[];
		fillableByPositions: {
			_id: string;
			name: string;
		}[];
		viewableByPositions: {
			_id: string;
			name: string;
		}[];
		form: Form;
	}[];

	clientIntakeForms: {
		order: number;
		form: Form;
	}[];

	createdAt: string;
	updatedAt: string;
};

//client request service
type ClientRequestService = {
	_id: string;
	serviceId: string;
	clientId: string;
	clientIntakeForm: string[];
	status: string;
	companyId: string;
	createdAt: string;
	updatedAt: string;
};

//intake submission
type IntakeSubmission = {
	_id: string;
	ownerId: string;
	formId: string;
	submissionType: string;
	fieldsData: {
		order: number;
		value: string | number;
	}[];
	status: string;
	submittedBy: string;
	createdAt: string;
	updatedAt: string;
	submittedAt: string;
};
