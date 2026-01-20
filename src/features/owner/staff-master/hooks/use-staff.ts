import { useState, useEffect } from "react";
import { getCompanyEmployees } from "../services/staff-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";

export const useStaff = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchEmployees();
	}, []);

	const fetchEmployees = async () => {
		setLoading(true);
		setError(null);
		const { data: res, error } = await handleApi(() => getCompanyEmployees());

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data karyawan", error.message);
			return;
		}

		if (res?.data) {
			setEmployees(res.data);
		}
	};

	return {
		employees,
		loading,
		error,
		refetch: fetchEmployees,
	};
};
