import axios from "@/lib/api";

export const getPositionsApi = async () => {
	const response = await axios.get<GetAllPosition>("/positions");
	return response.data;
};

export const createPositionApi = async (data: PositionRequest) => {
	const response = await axios.post<SinglePositionResponse>("/positions", data);
	return response.data;
};

export const updatePositionApi = async (
	id: string,
	data: UpdatePositionRequest,
) => {
	const response = await axios.put<SinglePositionResponse>(
		`/positions/${id}`,
		data,
	);
	return response.data;
};

export const getDetailPositionApi = async (id: string) => {
	const response = await axios.get<DetailPositionResponse>(`/positions/${id}`);
	return response.data;
};

export const deletePositionApi = async (id: string) => {
	const response = await axios.delete(`/positions/${id}`);
	return response.data;
};

