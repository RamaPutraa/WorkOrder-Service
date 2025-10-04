import {
	AppLayout,
	AuthLayout,
	PublicLayout,
	RootLayout,
} from "@/shared/templates";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/client-reg-page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardOwner from "@/features/owner/dahsboard-client";
import DashboardClient from "@/features/client/dashboard-client";
import DashboardStaff from "@/features/staff/dashboard-staff";
import DashboardUnassigned from "@/features/staff/dashboard-unassigned";
import LandingPage from "@/features/public/landing-page";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import CompanyRegis from "@/features/auth/pages/company-reg-page";

const router = createBrowserRouter([
	{
		element: <ProtectedRoute allowedRoles={["owner_company"]} />,
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [{ path: "/dashboard/owner", element: <DashboardOwner /> }],
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={["staff_company"]} />,
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [{ path: "/dashboard/staff", element: <DashboardStaff /> }],
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={["staff_unassigned"]} />,
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [
					{ path: "/dashboard/unassigned", element: <DashboardUnassigned /> },
				],
			},
		],
	},
	{
		element: <ProtectedRoute allowedRoles={["client"]} />,
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [{ path: "/dashboard/client", element: <DashboardClient /> }],
			},
		],
	},
	{
		element: <GuestRoute />,
		children: [
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
		],
	},
	{
		element: (
			<RootLayout>
				<PublicLayout />
			</RootLayout>
		),
		children: [
			{
				path: "/",
				element: <LandingPage />,
			},
			{
				path: "/company-regis",
				element: <CompanyRegis />,
			},
		],
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
