// login
type LoginRequest = {
	email: string;
	password: string;
};

type LoginResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// client register
type RegisterRequest = {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string;
};

type RegisterResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// company + owner register
type RegisterCompanyRequest = {
	name: string;
	email: string;
	password: string;
	companyName: string;
};

type RegisterCompanyResponse = ApiResponse<{
	user: User;
	token: string;
}>;

// staff register
type RegisterStaffRequest = {
	name: string;
	email: string;
	password: string;
	role: string;
};

type RegisterStaffResponse = ApiResponse<{
	user: User;
	token: string;
}>;

type GetProfileResponse = ApiResponse<User>;
