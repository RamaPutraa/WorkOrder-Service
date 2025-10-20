import axios from "@/lib/api";

export const getPositionsApi = async () => {
	const response = await axios.get<GetAllPosition>("/positions");
	return response.data;
};

export const createPositionApi = async (data: PositionRequest) => {
	const response = await axios.post<SinglePositionResponse>("/positions", data);
	return response.data;
};
