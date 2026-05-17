import { useState, useEffect } from "react";
import {
	startPairing,
	completePairing,
	detachPairedAccount,
} from "../services/pairing-account";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";

export const usePairingAccount = () => {
	const [isPairing, setIsPairing] = useState(false);
	const [localPaired, setLocalPaired] = useState(false);
	const [isDetaching, setIsDetaching] = useState(false);

	useEffect(() => {
		const handleMessage = async (event: MessageEvent) => {
			// Pastikan pesan datang dari origin kita sendiri
			if (event.origin !== window.location.origin) return;

			if (event.data?.type === "OAUTH_CALLBACK") {
				const { code, state, company_id, error } = event.data.payload;

				if (error) {
					console.error("Pairing error:", error);
					setIsPairing(false);
					notifyError(`Proses gagal: ${error}`);
					return;
				}

				if (code && state && company_id) {
					const { data: res, error: apiError } = await handleApi(() =>
						completePairing({
							company_id,
							code,
							state,
						}),
					);

					if (apiError) {
						console.error("Failed to complete pairing", apiError);
						notifyError(`Gagal terhubung : ${apiError.message}`);
					} else if (res) {
						setLocalPaired(true);
						notifySuccess("Akun berhasil terhubung!");
					}

					setIsPairing(false);
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

		const { data: res, error } = await handleApi(() =>
			startPairing({
				redirect_base_url: import.meta.env.VITE_CALLBACK_URL,
				company_id: companyId,
			}),
		);

		if (error) {
			console.error("Failed to start pairing", error);
			if (popup) popup.close();
		} else if (res && res.data?.redirect_url && popup) {
			popup.location.href = res.data.redirect_url;
		} else if (popup) {
			popup.close();
		}

		setIsPairing(false);
	};

	const detachAccount = async (id: string) => {
		if (!id) return;
		setIsDetaching(true);

		const { data: res, error } = await handleApi(() =>
			detachPairedAccount(id),
		);

		if (error) {
			console.error("Failed to detach account", error);
			notifyError(`Gagal memutus akun : ${error.message}`);
		} else if (res) {
			setLocalPaired(false);
			notifySuccess("Akun berhasil diputus!");
		}

		setIsDetaching(false);
	};

	return {
		isPairing,
		isDetaching,
		localPaired,
		initiatePairing,
		detachAccount,
	};
};
