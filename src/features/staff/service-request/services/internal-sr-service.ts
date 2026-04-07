import ApiClient from "@/lib/api";

export const getSrHistory = async () => {
	const response = await ApiClient.get<RequesterSRResponse>(
		"/service-requests/sent",
	);
	return response.data;
};

export const getSrById = async (id: string) => {
	const response = await ApiClient.get<RequesterSRDetailResponse>(
		`/service-request/${id}`,
	);
	return response.data;
};

export const getSrIntakeFormStaffById = async (id: string) => {
	const response = await ApiClient.get<RequesterSRIntakeFormResponse>(
		`/services/${id}/intake-form`,
	);
	return response.data;
};

export const submitSrIntakeStaffById = async (
	id: string,
	data: RequesterSubmitRequest,
) => {
	const response = await ApiClient.post<RequesterSubmitResponse>(
		`/service-requests/service/${id}`,
		data,
	);
	return response.data;
};
