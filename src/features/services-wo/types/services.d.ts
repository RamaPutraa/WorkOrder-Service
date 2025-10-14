type Staff = {
	position: Position;
	minimumStaff: number;
	maximumStaff: number;
};

// services
type Service = {
	_id: string;
	title: string;
	description: string;
	requiredStaff: Staff[];
	accessType: string;
	isActive: boolean;
};

type GetAllServicesResponse = ApiResponse<Service[]>;
