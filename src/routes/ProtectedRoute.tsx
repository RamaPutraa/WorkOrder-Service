import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

type Props = {
	allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
	const { token, user, isAuthenticated } = useAuthStore();

	// Kalau belum login → redirect ke login
	if (!token || !isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	// Kalau user login tapi role tidak diizinkan → redirect ke dashboard sesuai role-nya
	if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) {
		return <Navigate to={redirectToRoleDashboard(user?.role ?? "")} replace />;
	}

	// Kalau lolos semua pengecekan → render children route
	return <Outlet />;
}
