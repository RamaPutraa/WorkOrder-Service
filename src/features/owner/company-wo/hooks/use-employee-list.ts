import { useState } from "react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getStaffListForAssign } from "../services/company-wo-service";

/**
 * Hook kecil khusus untuk fetch daftar employee.
 * Dipisahkan dari useCompanyWo agar tidak men-trigger
 * fetch GET /workorders saat dipakai di halaman detail.
 */
export const useEmployeeList = () => {
	const [employees, setEmployees] = useState<StaffItem[]>([]);
	const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

	const fetchEmployeeList = async () => {
		setIsLoadingEmployees(true);
		const { data: res, error } = await handleApi(() => getStaffListForAssign());
		setIsLoadingEmployees(false);

		if (error) {
			notifyError("Gagal memuat data karyawan", error.message);
			return;
		}

		setEmployees(res?.data ?? []);
	};

	return { employees, isLoadingEmployees, fetchEmployeeList };
};
