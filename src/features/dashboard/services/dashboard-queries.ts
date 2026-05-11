import { useQuery } from "@tanstack/react-query";
import {
	getDashboardCompany,
	getDashboardSR,
	getDashboardWO,
} from "./dashboard-service";

export const useGetDashboardSR = (period_type: string) => {
	return useQuery({
		queryKey: ["dashboard-sr", period_type],
		queryFn: () => getDashboardSR(period_type),
		enabled: !!period_type,
	});
};

export const useGetDashboardWO = (period_type: string) => {
	return useQuery({
		queryKey: ["dashboard-wo", period_type],
		queryFn: () => getDashboardWO(period_type),
		enabled: !!period_type,
	});
};

export const useGetDashboardCompany = () => {
	return useQuery({
		queryKey: ["dashboard-company"],
		queryFn: () => getDashboardCompany(),
	});
};
