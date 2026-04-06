import ApiClient from "@/lib/api";
import { dummyInternalServiceRequests } from "../mocks/internal-services-request.mock";

const USE_MOCK = true;

export const getSrHistory = async () => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyInternalServiceRequests,
			message: "Success (Mock)",
			status: 200,
		} as RequesterSRResponse;
	}

	const response = await ApiClient.get<RequesterSRResponse>(
		"/service-request/sent",
	);
	return response.data;
};

export const getSrById = async (id: string) => {
	if (USE_MOCK) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return {
			data: dummyInternalServiceRequests.find((req) => req._id === id),
			message: "Success (Mock)",
			status: 200,
		} as RequesterSRDetailResponse;
	}

	const response = await ApiClient.get<RequesterSRDetailResponse>(
		`/service-request/${id}`,
	);
	return response.data;
};
