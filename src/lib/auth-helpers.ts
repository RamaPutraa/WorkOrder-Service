export function redirectToRoleDashboard(role: string) {
	switch (role) {
		case "owner_company":
			return "/dashboard/internal";
		case "manager_company":
			return "/dashboard/manager";
		case "staff_company":
			return "/dashboard/staff";
		case "staff_unassigned":
			return "/dashboard/unassigned";
		case "client":
			return "/dashboard/client";
		default:
			return "/";
	}
}
