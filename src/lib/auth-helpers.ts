export function redirectToRoleDashboard(role: string) {
	switch (role) {
		case "owner_company":
			return "/dashboard/owner";
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
