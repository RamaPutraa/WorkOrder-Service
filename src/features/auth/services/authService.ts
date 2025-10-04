import axios from "@/lib/api";

import type {
	RegisterResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterCompanyRequest,
	RegisterCompanyResponse,
} from "@/types/";

export const loginApi = async (data: LoginRequest) => {
	const response = await axios.post<LoginResponse>("/auth/login", data);
	return response.data;
};

export const clientRegisterApi = async (data: RegisterRequest) => {
	const response = await axios.post<RegisterResponse>("/auth/register", data);
	return response.data;
};

export const registerCompanyApi = async (data: RegisterCompanyRequest) => {
	const response = await axios.post<RegisterCompanyResponse>(
		"/auth/register-company",
		data
	);
	return response.data;
};
