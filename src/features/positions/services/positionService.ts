import axios from "@/lib/api";

export const getPositionsApi = async () => {
	const response = await axios.get<PositionResponse>("/positions");
	return response.data;
};
