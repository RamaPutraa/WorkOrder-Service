import { useState, useCallback } from "react";
import { getCompanyEmployees } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { useStaffCompanyStore } from "@/store/staffStore";

export const useStaff = () => {
	const store = useStaffCompanyStore();
	const [employees, setEmployees] = useState<Employee[]>(
		store.isStaffCompanyStale() ? [] : store.staffCompany,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEmployees = useCallback(async () => {
		if (!store.isStaffCompanyStale()) {
			setEmployees(store.staffCompany);
			return;
		}
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() => getCompanyEmployees());

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data karyawan", error.message);
			return;
		}

		const data = res?.data || [];
		setEmployees(data);
		store.setStaffCompany(data);
	}, [store]);

	return {
		employees,
		loading,
		error,
		fetchEmployees,
	};
};
