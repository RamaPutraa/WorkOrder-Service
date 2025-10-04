import type { ApiResponse } from "@/lib/api";
import type { User } from "./entity";

// login
export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// client register
export type RegisterRequest = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export type RegisterResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// company + owner register
export type RegisterCompanyRequest = {
	name: string;
	email: string;
	password: string;
	companyName: string;
};

export type RegisterCompanyResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// staff register
