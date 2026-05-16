import { useState, useEffect } from "react";
import { startPairing, completePairing } from "../services/pairing-account";

export const usePairingAccount = () => {
	const [isPairing, setIsPairing] = useState(false);
	const [localPaired, setLocalPaired] = useState(false);

	useEffect(() => {
		const handleMessage = async (event: MessageEvent) => {
			// Pastikan pesan datang dari origin kita sendiri
			if (event.origin !== window.location.origin) return;

			if (event.data?.type === "OAUTH_CALLBACK") {
				const { code, state, company_id, error } = event.data.payload;

				if (error) {
					console.error("Pairing error:", error);
					setIsPairing(false);
					// TODO: Tampilkan toast/notifikasi error jika perlu
					return;
				}

				if (code && state && company_id) {
					try {
						const response = await completePairing({
							code,
							state,
							company_id,
						});
						if (response) {
							setLocalPaired(true);
						}
					} catch (err) {
						console.error("Failed to complete pairing", err);
					} finally {
						setIsPairing(false);
					}
				}
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	const initiatePairing = async (companyId: string) => {
		if (!companyId) return;
		setIsPairing(true);

		// Buka tab baru kosong dulu untuk mencegah popup blocker
		const popup = window.open("", "_blank");

		try {
			const response = await startPairing({
				platform: "web",
				company_id: companyId,
			});
			
			if (response.data?.redirect_url && popup) {
				popup.location.href = response.data.redirect_url;
			} else if (popup) {
				popup.close();
				setIsPairing(false);
			}
		} catch (err) {
			console.error("Failed to start pairing", err);
			if (popup) popup.close();
			setIsPairing(false);
		}
	};

	return {
		isPairing,
		localPaired,
		initiatePairing,
	};
};
