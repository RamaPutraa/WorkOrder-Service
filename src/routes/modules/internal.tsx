import CompanyTypeView from "@/features/owner/template/pages/company-type-view";
import ServicesTypeView from "@/features/owner/template/pages/services-type-view";
import { lazy } from "react";
import { type RouteObject, Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

// Lazy Load Pages
const DashboardOwner = lazy(
	() => import("@/features/dashboard/pages/dashboard-owner"),
);
const FormPage = lazy(() => import("@/features/owner/form/pages/view-form"));
const CreateFormPage = lazy(
	() => import("@/features/owner/form/pages/create-form"),
);
const DetailFormPage = lazy(
	() => import("@/features/owner/form/pages/detail-form"),
);
const EditFormPage = lazy(
	() => import("@/features/owner/form/pages/edit-form"),
);
const PositionPage = lazy(
	() => import("@/features/owner/position/pages/view-position"),
);
const CreatePositionPage = lazy(
	() => import("@/features/owner/position/pages/create-position"),
);
const ProfileCompany = lazy(
	() => import("@/features/owner/company/pages/profile-company"),
);
const ViewService = lazy(
	() => import("@/features/owner/services-wo/pages/view-service"),
);
const CreateService = lazy(
	() => import("@/features/owner/services-wo/pages/create-service"),
);
const EditService = lazy(
	() => import("@/features/owner/services-wo/pages/edit-service"),
);
const DetailService = lazy(
	() => import("@/features/owner/services-wo/pages/detail-service"),
);
const ViewServiceRequest = lazy(
	() => import("@/features/owner/business/pages/view-service-request"),
);
const DetailServiceRequest = lazy(
	() => import("@/features/owner/business/pages/detail-service-request"),
);
const CompanyViewWo = lazy(
	() => import("@/features/owner/company-wo/pages/company-view-wo"),
);
const CompanyDetailWo = lazy(
	() => import("@/features/owner/company-wo/pages/company-detail-wo"),
);
const CompanyReportWo = lazy(
	() => import("@/features/owner/company-wo/pages/company-report-wo"),
);
const ViewStaff = lazy(
	() => import("@/features/owner/staff-master/pages/view-staff"),
);
const HistoryStaffInvitations = lazy(
	() => import("@/features/owner/staff-master/pages/history-staff-invitations"),
);
const ViewMemberCodes = lazy(
	() => import("@/features/owner/membercodes/pages/view-membercode"),
);
const CreateMembercode = lazy(
	() => import("@/features/owner/membercodes/pages/create-membercode"),
);
const WoServicesList = lazy(
	() => import("@/features/owner/wo-create/pages/services-list"),
);
const WoServicesDetail = lazy(
	() => import("@/features/owner/wo-create/pages/services-detail"),
);
const ViewFaq = lazy(() => import("@/features/owner/faqs/pages/view-faq"));
const ViewPricePage = lazy(
	() => import("@/features/owner/pricing/pages/view-price"),
);

const InternalIndex = () => {
	const { user } = useAuth();
	if (user?.role === "manager_company") return <Navigate to="/dashboard/manager" replace />;
	if (user?.role === "staff_company") return <Navigate to="/dashboard/staff" replace />;
	return <DashboardOwner />;
};

export const internalRoutes: RouteObject[] = [
	{
		path: "",
		element: <InternalIndex />,
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
		path: "faqs",
		element: <ViewFaq />,
	},
	{
		path: "pricing",
		element: <ViewPricePage />,
	},
	{
		path: "wo-create/services",
		element: <WoServicesList />,
	},
	{
		path: "wo-create/services/detail/:id",
		element: <WoServicesDetail />,
	},
	{
		path: "services/create/company-type",
		element: <CompanyTypeView />,
	},
	{
		path: "services/create/services-type",
		element: <ServicesTypeView />,
	},
];
