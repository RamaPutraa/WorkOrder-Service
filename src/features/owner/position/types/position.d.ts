type PositionRequest = {
	name: string;
	description: string;
};
type GetAllPosition = ApiResponse<Position[]>;

type SinglePositionResponse = ApiResponse<Position>;
