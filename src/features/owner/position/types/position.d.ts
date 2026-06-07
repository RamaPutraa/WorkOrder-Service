type PositionRequest = {
	name: string;
	description: string;
	isActive?: boolean;
};
type GetAllPosition = ApiResponse<Position[]>;

type UpdatePositionRequest = {
	name?: string;
	description?: string;
	isActive?: boolean;
};

type EmployeePosition = {
	_id: string;
	name: string;
	email: string;
	role: "staff_company" | "manager_company" | "owner_company";
	companyId: string;
	positionId: string;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string | null;
}

type DetailPositision = {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	companyId: string;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	__v: number;
	employee: EmployeePosition[];
}

type SinglePositionResponse = ApiResponse<Position>;

type DetailPositionResponse = ApiResponse<DetailPositision> & {
	meta: {
		canDelete: boolean;
	}
};