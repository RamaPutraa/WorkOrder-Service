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
						redirect_url: `http://localhost:3000/mock-external-auth?redirect_uri=${encodeURIComponent("http://localhost:3000/dashboard/client/pairing/callback")}&state=${randomState}&company_id=${data.company_id}`,
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
	if (IS_MOCK) {
		return new Promise<getAllPairedAccountResponse>((resolve) => {
			setTimeout(() => {
				resolve({
					message: "Success",
					data: [
						{
							_id: "pair-1",
							external_customer_email: "johndoe@example.com",
							external_customer_name: "John Doe",
							company: {
								_id: "comp-1",
								name: "PT. Solusi Maju Bersama",
							} as any,
							paired_at: new Date("2024-05-15T10:00:00Z"),
						},
						{
							_id: "pair-2",
							external_customer_email: "johndoe.work@other.com",
							external_customer_name: "John Doe Work",
							company: {
								_id: "comp-2",
								name: "Tech Nusantara Inc.",
							} as any,
							paired_at: new Date("2024-05-10T14:30:00Z"),
						},
					],
				});
			}, 600);
		});
	}

	const response =
		await apiClient.get<getAllPairedAccountResponse>("/customer-pairing");
	return response.data;
};

export const getPairedAccountInCompany = async (id: string) => {
	if (IS_MOCK) {
		return new Promise<getPairedAccountInCompanyResponse>((resolve) => {
			setTimeout(() => {
				resolve({
					status: true,
					message: "Success",
					data: {
						_id: "ext-123",
						external_customer_email: "johndoe@example.com",
						external_customer_name: "John Doe",
						company: {
							_id: id,
							name: "PT. Solusi Maju Bersama",
						} as any,
						paired_at: new Date(),
					},
				} as getPairedAccountInCompanyResponse);
			}, 600);
		});
	}

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
