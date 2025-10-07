type ApiResponse<T> = {
	message?: string;
	data?: T;
	errors?: Record<string, string[]>;
};
