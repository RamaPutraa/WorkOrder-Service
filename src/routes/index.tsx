import { AppLayout, AuthLayout, RootLayout } from "@/components/templates";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardOwner from "@/pages/dashboard/DashboardOwner";
import DashboardClient from "@/pages/dashboard/DashboardClient";
import DashboardStaff from "@/pages/dashboard/DashboardStaff";
import DashboardUnassigned from "@/pages/dashboard/DashboardUnassigned";

const router = createBrowserRouter([
	{
		element: (
			<RootLayout>
				<AppLayout />
			</RootLayout>
		),
		children: [
			{
				path: "/dashboard/owner",
				element: <DashboardOwner />,
			},
			{
				path: "/dashboard/staff",
				element: <DashboardStaff />,
			},
			{
				path: "/dashboard/unassigned",
				element: <DashboardUnassigned />,
			},
			{
				path: "/dashboard/client",
				element: <DashboardClient />,
			},
		],
	},
	{
		element: (
			<RootLayout>
				<AuthLayout />
			</RootLayout>
		),
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/register",
				element: <RegisterPage />,
			},
		],
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
