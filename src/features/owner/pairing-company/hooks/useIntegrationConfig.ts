import { useState, useEffect, useCallback } from "react";
import {
	getIntegrationConfig,
	updateCompanyIntegration,
} from "../services/pairing-company";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

export const useIntegrationConfig = () => {
	const [config, setConfig] = useState<IntegrationConfig | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchConfig = useCallback(async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() =>
			getIntegrationConfig(),
		);
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat konfigurasi integrasi", error.message);
			return;
		}
		if (res?.data) {
			setConfig(res.data);
		}
	}, []);

	useEffect(() => {
		fetchConfig();
	}, [fetchConfig]);

	const handleUpdate = useCallback(
		async (data: IntegrationConfig) => {
			setSubmitting(true);
			const { data: res, error } = await handleApi(() =>
				updateCompanyIntegration(data),
			);
			setSubmitting(false);

			if (error) {
				notifyError("Gagal memperbarui konfigurasi integrasi", error.message);
				return false;
			}

			if (res?.data) {
				setConfig(res.data);
			}

			notifySuccess("Berhasil", "Konfigurasi integrasi berhasil diperbarui");
			return true;
		},
		[],
	);

	const handleToggleIntegration = useCallback(
		async (value: boolean) => {
			if (!config) return false;
			return handleUpdate({ ...config, is_integration_active: value });
		},
		[config, handleUpdate],
	);

	return {
		config,
		loading,
		submitting,
		error,
		refetch: fetchConfig,
		handleUpdate,
		handleToggleIntegration,
	};
};
