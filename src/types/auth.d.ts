import type { ApiResponse } from "@/lib/api";
import type { User } from "./entity";

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = ApiResponse<{
	user: User;
	token: string;
}>;
