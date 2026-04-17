import { AppLayout, PublicLayout, RootLayout } from "@/shared/templates";
import LoginPage from "@/features/auth/pages/login-page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardOwner from "@/features/owner/dahsboard-client";
import DashboardClient from "@/features/client/dashboard-client";
import LandingPage from "@/features/public/landing-page";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import CreateFormPage from "@/features/owner/form/pages/create-form";
import FormPage from "@/features/owner/form/pages/view-form";
import DetailFormPage from "@/features/owner/form/pages/detail-form";
import EditFormPage from "@/features/owner/form/pages/edit-form";
import PositionPage from "@/features/owner/position/pages/view-position";
import CreatePositionPage from "@/features/owner/position/pages/create-position";
import ProfileCompany from "@/features/owner/company/pages/profile-company";
import ViewService from "@/features/owner/services-wo/pages/view-service";
import CreateService from "@/features/owner/services-wo/pages/create-service";
import EditService from "@/features/owner/services-wo/pages/edit-service";
import ClientCompanyServices from "@/features/client/company/pages/company-services";
import PublicServicePage from "@/features/client/services-wo/pages/service-request";
import ErrorPage from "@/shared/errors/templates/error-page";
import NotFoundPage from "@/shared/errors/templates/not-found-page";
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
// import CompanyReportWo from "@/features/owner/company-wo/pages/company-report-wo";
import HistoryStaffInvitations from "@/features/owner/staff-master/pages/history-staff-invitations";
import InvitationsHistory from "@/features/staff/invitations/pages/invitations-history";
import ProfilePage from "@/features/auth/pages/profile";
import HeroRegis from "@/features/auth/pages/hero-section-regis";
import ClientRegisterPage from "@/features/auth/pages/client-reg-page";
import InternalRegisterPage from "@/features/auth/pages/internal-reg-page";
import ViewMemberCodes from "@/features/owner/membercodes/pages/view-membercode";
import CreateMembercode from "@/features/owner/membercodes/pages/create-membercode";
import SrHistory from "@/features/staff/service-request/pages/sr-history";
import SrDetailHistory from "@/features/staff/service-request/pages/sr-detail-history";
import ListServices from "@/features/staff/service-request/pages/list-services";
import ServiceForm from "@/features/staff/service-request/pages/services-form";
import SrConfirmation from "@/features/staff/service-request-confirmation/pages/sr-confirmation";
import CompanyReportWo from "@/features/owner/company-wo/pages/company-report-wo";
import WoServicesList from "@/features/owner/wo-create/pages/services-list";
import WoServicesDetail from "@/features/owner/wo-create/pages/services-detail";

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
						path: "form/edit/:id",
						element: <EditFormPage />,
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
						element: <ProfileCompany />,
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
						path: "services/edit/:id",
						element: <EditService />,
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
					{
						path: "membercodes",
						element: <ViewMemberCodes />,
					},
					{
						path: "membercodes/create",
						element: <CreateMembercode />,
					},
					{
						path: "wo-create/services",
						element: <WoServicesList />,
					},
					{
						path: "wo-create/services/detail/:id",
						element: <WoServicesDetail />,
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
		path: "/dashboard/staff",
		element: <ProtectedRoute allowedRoles={["staff_company"]} />,
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
						path: "services-request/confirmation",
						element: <SrConfirmation />,
					},
					{
						path: "services",
						element: <ListServices />,
					},
					{
						path: "services/:id/form-intake",
						element: <ServiceForm />,
					},
					{
						path: "services-request/history",
						element: <SrHistory />,
					},
					{
						path: "services-request/history/:id",
						element: <SrDetailHistory />,
					},
				],
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
						<PublicLayout />
					</RootLayout>
				),
				children: [
					{
						path: "/login",
						element: <LoginPage />,
					},
					{
						path: "/register",
						element: <ClientRegisterPage />,
					},
					{
						path: "/company-regis",
						element: <InternalRegisterPage />,
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
				path: "/hero-regis",
				element: <HeroRegis />,
			},
		],
	},
	{
		path: "/dashboard/account",
		element: (
			<ProtectedRoute
				allowedRoles={[
					"owner_company",
					"manager_company",
					"staff_company",
					"staff_unassigned",
					"client",
				]}
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
						element: <ProfilePage />,
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
