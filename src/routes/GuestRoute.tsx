import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

export default function GuestRoute() {
	const { token, user, isAuthenticated } = useAuthStore();

	// Kalau sudah login → kirim langsung ke dashboard sesuai role
	if (token && isAuthenticated && user?.role) {
		return <Navigate to={redirectToRoleDashboard(user.role)} replace />;
	}

	return <Outlet />;
}
