type Position = {
	_id: string;
	name: string;
	companyId: string;
	createdAt: string;
	updatedAt: string;
};

type Employee = {
	_id: string;
	name: string;
	email: string;
	role: string;
	position?: Position;
};

type CompanyEmployeesData = {
	company: {
		_id: string;
		name: string;
	};
	employees: Employee[];
};

type CompanyEmployeesResponse = ApiResponse<CompanyEmployeesData> & {
	meta: {
		count: number;
	};
};
