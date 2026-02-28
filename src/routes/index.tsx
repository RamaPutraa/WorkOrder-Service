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
import PublicServicePage from "@/features/client/services-wo/pages/service-request";
import ErrorPage from "@/shared/errors/templates/error-page";
import DetailService from "@/features/owner/services-wo/pages/detail-service";
import ServiceSubmitPage from "@/features/client/services-wo/pages/services-submit";
import ServiceDetailSubmit from "@/features/client/services-wo/pages/services-detail-submit";
import ViewServiceRequest from "@/features/owner/business/pages/view-service-request";
import DetailServiceRequest from "@/features/owner/business/pages/detail-service-request";
import CompanyViewWo from "@/features/owner/company-wo/pages/company-view-wo";
import CompanyDetailWo from "@/features/owner/company-wo/pages/company-detail-wo";
import ViewStaff from "@/features/owner/staff-master/pages/view-staff";
import CompanyList from "@/features/client/company/pages/company-list";
import ServicesList from "@/features/client/services-wo/pages/services-list";
import DashboardStaff from "@/features/staff/dahsboard-staff";
import DashboardManager from "@/features/manager/dashboard-manager";
import CompanyReportWo from "@/features/owner/company-wo/pages/company-report-wo";
import HistoryStaffInvitations from "@/features/owner/staff-master/pages/history-staff-invitations";
import InvitationsHistory from "@/features/staff/invitations/pages/invitations-history";

const router = createBrowserRouter([
	{
		path: "/dashboard/internal",
		element: (
			<ProtectedRoute
				allowedRoles={["owner_company", "manager_company", "staff_company"]}
			/>
		),
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
						path: "staff",
						element: <ViewStaff />,
					},
					{
						path: "staff/history-invitations",
						element: <HistoryStaffInvitations />,
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
					{
						path: "business/services/request",
						element: <ViewServiceRequest />,
					},
					{
						path: "business/services/request/detail/:id",
						element: <DetailServiceRequest />,
					},
					{
						path: "workorders",
						element: <CompanyViewWo />,
					},
					{
						path: "workorders/detail/:id",
						element: <CompanyDetailWo />,
					},
					{
						path: "workorders/:id/report",
						element: <CompanyReportWo />,
					},
				],
			},
		],
	},
	{
		path: "/dashboard/manager",
		element: <ProtectedRoute allowedRoles={["manager_company"]} />,
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
						element: <DashboardManager />,
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
		path: "/dashboard/unassigned",
		element: (
			<ProtectedRoute allowedRoles={["staff_unassigned", "staff_company"]} />
		),
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
						element: <DashboardStaff />,
					},
					{
						path: "invitations-history",
						element: <InvitationsHistory />,
					},
				],
			},
		],
	},
	{
		path: "/dashboard/client",
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
						path: "",
						element: <DashboardClient />,
					},
					{
						path: "companies",
						element: <CompanyList />,
					},
					{
						path: "company/:id/services",
						element: <ClientCompanyServices />,
					},
					{
						path: "company/services/:id/intake-forms",
						element: <PublicServicePage />,
					},
					{
						path: "services/",
						element: <ServicesList />,
					},
					{
						path: "submissions",
						element: <ServiceSubmitPage />,
					},
					{
						path: "submissions/:id",
						element: <ServiceDetailSubmit />,
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
