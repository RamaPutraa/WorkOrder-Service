// users
type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	company?: Company;
	position?: Position;
};

// potisions
type Position = {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	companyId: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

// staff item
type StaffItem = {
	_id: string;
	name: string;
	email: string;
	role: string;
	position: Position;
};

// employees
type EmployeeGroup = {
	company: CompanyMinimal;
	employees: StaffItem[];
};

// forms
type Form = {
	_id: string;
	title: string;
	description: string;
	formType: string;
	fields: Field[];
	createdAt: string;
	updatedAt: string;
};

// Companies
type CompanyMinimal = {
	_id: number;
	name: string;
};
type Company = CompanyMinimal & {
	address: string;
	description: string;
	managers: User[];
	staffs: User[];
	isActive: boolean;
	deletedAt: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	owner: {
		_id: string;
		name: string;
		email: string;
	};
};

// Services
type Service = {
	_id: string;
	companyId: string;
	title: string;
	description: string;
	accessType: string;
	isActive: boolean;

	requiredStaffs: {
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

//client submit service
type ClientIntakeForm = {
	order: number;
	form: Form;
};
type PublicServiceSubmited = {
	_id: string;
	serviceId: string;
	clientId: string;
	clientIntakeForm: ClientIntakeForm[];
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
