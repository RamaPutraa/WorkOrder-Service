import apiClient from "@/lib/api";

export const startPairing = async (data: StartPairingRequest) => {
	// REAL IMPLEMENTATION
	const response = await apiClient.post<getStartPairingResponse>(
		"/customer-pairing/start",
		data,
	);
	return response.data;
};

export const completePairing = async (data: CompletePairingRequest) => {
	const response = await apiClient.post<getCompletePairingResponse>(
		"/customer-pairing/complete",
		data,
	);
	return response.data;
};

export const getAllPairedAccount = async () => {
	const response =
		await apiClient.get<getAllPairedAccountResponse>("/customer-pairing");
	return response.data;
};

export const getPairedAccountInCompany = async (id: string) => {
	const response = await apiClient.get<getPairedAccountInCompanyResponse>(
		`customer-pairing/company/${id}`,
	);
	return response.data;
};

export const detachPairedAccount = async (id: string) => {
	const response = await apiClient.delete<detachPairedAccountResponse>(
		`customer-pairing/${id}`,
	);
	return response.data;
};
