import axios from "@/lib/api";

import type { LoginRequest, LoginResponse } from "@/types/";

export const loginApi = async (data: LoginRequest) => {
	const response = await axios.post<LoginResponse>("/auth/login", data);
	return response.data;
};
