import { useState, useEffect } from "react";
import {
	getCompanyProfileApi,
	updateCompanyApi,
} from "../services/companyServices";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useProfileStore } from "@/store/profileStore";

export const useCompanyProfile = () => {
	const [company, setCompany] = useState<Company | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		fetchCompanyProfile();
	}, []);
	const fetchCompanyProfile = async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() => getCompanyProfileApi());
		setLoading(false);
		if (error) {
			setError(error.message);
			notifyError("Gagal memuat profil perusahaan", error.message);
			return;
		}
		if (res?.data) {
			const item = Array.isArray(res.data) ? res.data[0] : res.data;
			setCompany(item ?? null);
		}
	};
	return {
		company,
		loading,
		error,
		refetch: fetchCompanyProfile,
	};
};

export const useUpdateCompany = (onSuccess?: () => void) => {
	const [loading, setLoading] = useState(false);

	const updateCompany = async (id: string, data: UpdateCompanyRequest) => {
		setLoading(true);
		const { data: res, error } = await handleApi(() =>
			updateCompanyApi(data, id),
		);
		setLoading(false);

		if (error) {
			notifyError("Gagal memperbarui perusahaan", error.message);
			return false;
		}

		// Update global profile store with new company data
		if (res?.data) {
			useProfileStore.getState().updateProfile({
				company: res.data,
			});
		}

		notifySuccess("Berhasil", "Data perusahaan berhasil diperbarui");
		onSuccess?.();
		return true;
	};

	return { updateCompany, loading };
};
