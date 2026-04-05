import apiClient from "@/lib/api";
import {
	dummyPublicServiceRequests,
	dummyRequesterServiceDetailRequest,
} from "../mocks/public-service-request.mock";

const USE_MOCK = true; // TODO: Ubah ke false jika API backend sudah siap

// TODO:ubah kalau endpoint udah jadi
export const getDetailServiceByIdApi = async (id: string) => {
	const response = await apiClient.get<PublicDetailService>(
		`/public/services/${id}/intake-forms`,
	);
	return response.data;
};

export const submitIntakeApi = async (
	id: string,
	data: PublicSubmitRequest,
) => {
	// TODO:revisi endpoint kalao suda jadi
	const response = await apiClient.post<PublicSubmitResponse>(
		`/public/services/${id}/intake-forms`,
		data,
	);
	return response.data;
};

export const getAllClientServiceRequestApi = async () => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyPublicServiceRequests,
			message: "Success (Mock)",
			status: 200,
		} as RequesterSRResponse;
	}

	const response = await apiClient.get<RequesterSRResponse>(
		"/service-request/sent",
	);
	return response.data;
};

// TODO:pastiin kalo endpoint udah jadi
export const getDetailClientServiceRequestApi = async (id: string) => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const mockData =
			(dummyPublicServiceRequests.find(
				(req) => req._id === id,
			) as unknown as RequesterSRDetailRequest) ||
			dummyRequesterServiceDetailRequest;

		return {
			data: mockData,
			message: "Success (Mock)",
			status: 200,
		} as RequesterSRDetailResponse;
	}

	const response = await apiClient.get<RequesterSRDetailResponse>(
		`/service-requests/${id}`,
	);
	return response.data;
};
