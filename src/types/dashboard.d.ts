type dsServicesRequest = {
	status_count: {
		received: number;
		cancelled: number;
		rejected: number;
		approved: number;
		on_progress: number;
		completed: number;
		unprocessable: number;
		partial_completed: number;
		closed: number;
	};
	total_count: number;
};
type getDashboardSr = ApiResponse<dsServicesRequest>;

type dsWorkOrder = {
	status_count: {
		drafted: number;
		sent: number;
		approved: number;
		rejected: number;
		on_progress: number;
		completed: number;
		cancelled: number;
		failed: number;
	};
	total_count: number;
};
type getDashboardWo = ApiResponse<dsWorkOrder>;

type dsCompany = {
	forms_stat: {
		active: number;
		inActive: number;
		total: number;
	};
	services_stat: {
		active: number;
		inActive: number;
		total: number;
	};
	positions_stat: {
		active: number;
		inActive: number;
		total: number;
	};
	employees_stat: {
		active: number;
		inActive: number;
		total: number;
		managers_count: number;
		staffs_count: number;
	};
};
type getDashboardCompany = ApiResponse<dsCompany>;
