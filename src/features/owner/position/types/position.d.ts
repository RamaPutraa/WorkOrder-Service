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

type SinglePositionResponse = ApiResponse<Position>;
