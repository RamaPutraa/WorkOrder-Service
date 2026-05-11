import apiClient from "@/lib/api";

// dashboard sr
export const getDashboardSR = async (period_type: string) => {
	try {
		const response = await apiClient.get<getDashboardSr>(
			`/dashboard/service-request?period_type=${period_type}`,
		);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

// dashboard work order
export const getDashboardWO = async (period_type: string) => {
	try {
		const response = await apiClient.get<getDashboardWo>(
			`/dashboard/work-order?period_type=${period_type}`,
		);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

// dashboard company (owner only)
export const getDashboardCompany = async () => {
	try {
		const response =
			await apiClient.get<getDashboardCompany>(`/dashboard/company/`);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
