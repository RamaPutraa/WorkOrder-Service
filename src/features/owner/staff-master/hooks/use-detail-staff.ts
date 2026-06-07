import { useState, useCallback } from "react";
import { getDetailEmployeeApi, kickEmployeeApi } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useStaffCompanyStore } from "@/store/staffStore";

export const useDetailStaff = () => {
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [canKick, setCanKick] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDetailEmployee = useCallback(async (id: string) => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailEmployeeApi(id),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat detail pegawai", error.message);
			return;
		}

		setEmployee(res?.data || null);
		setCanKick(res?.meta?.canKick ?? false);
	}, []);

	const kickEmployee = useCallback(async (email: string) => {
		const { error } = await handleApi(() =>
			kickEmployeeApi({ email }),
		);

		if (error) {
			notifyError("Gagal mengeluarkan pegawai", error.message);
			return false;
		}

		notifySuccess("Berhasil", "Pegawai berhasil dikeluarkan dari perusahaan");
		useStaffCompanyStore.getState().clearStaffCompany();
		return true;
	}, []);

	return {
		employee,
		canKick,
		loading,
		error,
		fetchDetailEmployee,
		kickEmployee,
	};
};
