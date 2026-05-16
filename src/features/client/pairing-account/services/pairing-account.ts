import apiClient from "@/lib/api";

const IS_MOCK = true; // Ubah menjadi false jika backend sudah siap

export const startPairing = async (data: StartPairingRequest) => {
	if (IS_MOCK) {
		return new Promise<getStartPairingResponse>((resolve) => {
			setTimeout(() => {
				const randomState = Math.random().toString(36).substring(7);
				resolve({
					status: true,
					message: "Success",
					data: {
						redirect_url: `http://localhost:3000/mock-external-auth?state=${randomState}&company_id=${data.company_id}`,
					},
				} as getStartPairingResponse);
			}, 800);
		});
	}

	// REAL IMPLEMENTATION
	const response = await apiClient.post<getStartPairingResponse>(
		"/customer-pairing/start",
		data,
	);
	return response.data;
};

export const completePairing = async (data: CompletePairingRequest) => {
	if (IS_MOCK) {
		return new Promise<getCompletePairingResponse>((resolve, reject) => {
			setTimeout(() => {
				if (data.code === "mock_success_code") {
					resolve({
						status: true,
						message: "Pairing completed successfully",
						data: {
							id: "mock-ext-acc-123",
							platform: "mock_platform",
							account_id: "mock_acc_123",
							status: "active",
							company_id: data.company_id,
						} as any,
					} as getCompletePairingResponse);
				} else {
					reject(new Error("Invalid authorization code or state"));
				}
			}, 800);
		});
	}

	// REAL IMPLEMENTATION
	const response = await apiClient.post<getCompletePairingResponse>(
		"/customer-pairing/complete",
		data,
	);
	return response.data;
};

// TODO: kebawah ini semua belum
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
