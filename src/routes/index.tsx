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
import DashboardStaff from "@/features/owner/staff/dashboard-staff";
import DashboardUnassigned from "@/features/owner/staff/dashboard-unassigned";
import LandingPage from "@/features/public/landing-page";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import CompanyRegis from "@/features/auth/pages/company-reg-page";
import CreateFormPage from "@/features/owner/form/pages/create-form";
import FormPage from "@/features/owner/form/pages/view-form";
import DetailFormPage from "@/features/owner/form/pages/detail-form";
import PositionPage from "@/features/owner/position/pages/view-position";
import CreatePositionPage from "@/features/owner/position/pages/create-position";
import ViewCompany from "@/features/owner/company/pages/view-company";
import ViewService from "@/features/owner/services-wo/pages/view-service";
import CreateService from "@/features/owner/services-wo/pages/create-service";
import ClientCompanyServices from "@/features/client/company/pages/company-services";
import PublicServicePage from "@/features/client/services-wo/pages/request-services";
import ErrorPage from "@/shared/errors/templates/error-page";
import DetailService from "@/features/owner/services-wo/pages/detail-service";

const router = createBrowserRouter([
	{
		path: "/dashboard/owner",
		element: <ProtectedRoute allowedRoles={["owner_company"]} />,
		errorElement: <ErrorPage />,
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [
					{
						path: "",
						element: <DashboardOwner />,
					},
					{
						path: "forms",
						element: <FormPage />,
					},
					{
						path: "form/create",
						element: <CreateFormPage />,
					},
					{
						path: "form/detail/:id",
						element: <DetailFormPage />,
					},
					{
						path: "positions",
						element: <PositionPage />,
					},
					{
						path: "positions/create",
						element: <CreatePositionPage />,
					},
					{
						path: "company",
						element: <ViewCompany />,
					},
					{
						path: "services",
						element: <ViewService />,
					},
					{
						path: "services/create",
						element: <CreateService />,
					},
					{
						path: "services/detail/:id",
						element: <DetailService />,
					},
				],
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
				children: [
					{
						path: "/dashboard/client",
						element: <DashboardClient />,
					},
					{
						path: "/dashboard/client/company/:id/services",
						element: <ClientCompanyServices />,
					},
					{
						path: "/dashboard/client/company/services/:id/intake-forms",
						element: <PublicServicePage />,
					},
				],
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
	{
		path: "*",
		element: <ErrorPage status={404} />, // handle 404 juga
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
