import apiClient from "@/lib/api";

export const getAllInternalBusinessServiceRequestApi = async () => {
	const response = await apiClient.get<InboxSRResponse>(
		"/service-requests/inbox",
	);
	return response.data;
};

export const getDetailInternalBusinessServiceRequestApi = async (
	id: string,
) => {
	const response = await apiClient.get<InboxSRDetailResponse>(
		`/service-requests/${id}`,
	);
	return response.data;
};

export const rejectInternalBusinessServiceRequestApi = async (id: string) => {
	const response = await apiClient.patch<SRrejectResponse>(
		`/service-requests/${id}/reject`,
	);
	return response.data;
};

export const approveInternalBusinessServiceRequestApi = async (id: string) => {
	const response = await apiClient.patch<SRapprovedResponse>(
		`/service-requests/${id}/approve`,
	);
	return response.data;
};
