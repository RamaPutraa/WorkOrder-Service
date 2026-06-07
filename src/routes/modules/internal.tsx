import CompanyTypeView from "@/features/owner/template/pages/company-type-view";
import ServicesTypeView from "@/features/owner/template/pages/services-type-view";
import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { type RouteObject, Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

// Lazy Load Pages
const DashboardOwner = lazyWithRetry(
	() => import("@/features/dashboard/pages/dashboard-owner"),
);
const FormPage = lazyWithRetry(() => import("@/features/owner/form/pages/view-form"));
const CreateFormPage = lazyWithRetry(
	() => import("@/features/owner/form/pages/create-form"),
);
const DetailFormPage = lazyWithRetry(
	() => import("@/features/owner/form/pages/detail-form"),
);
const EditFormPage = lazyWithRetry(
	() => import("@/features/owner/form/pages/edit-form"),
);
const PositionPage = lazyWithRetry(
	() => import("@/features/owner/position/pages/view-position"),
);
const CreatePositionPage = lazyWithRetry(
	() => import("@/features/owner/position/pages/create-position"),
);
const DetailDepartementPage = lazyWithRetry(
	() => import("@/features/owner/position/pages/detail-departement"),
);
const ProfileCompany = lazyWithRetry(
	() => import("@/features/owner/company/pages/profile-company"),
);
const ViewService = lazyWithRetry(
	() => import("@/features/owner/services-wo/pages/view-service"),
);
const CreateService = lazyWithRetry(
	() => import("@/features/owner/services-wo/pages/create-service"),
);
const EditService = lazyWithRetry(
	() => import("@/features/owner/services-wo/pages/edit-service"),
);
const DetailService = lazyWithRetry(
	() => import("@/features/owner/services-wo/pages/detail-service"),
);
const ViewServiceRequest = lazyWithRetry(
	() => import("@/features/owner/business/pages/view-service-request"),
);
const DetailServiceRequest = lazyWithRetry(
	() => import("@/features/owner/business/pages/detail-service-request"),
);
const CompanyViewWo = lazyWithRetry(
	() => import("@/features/owner/company-wo/pages/company-view-wo"),
);
const CompanyDetailWo = lazyWithRetry(
	() => import("@/features/owner/company-wo/pages/company-detail-wo"),
);
const CompanyReportWo = lazyWithRetry(
	() => import("@/features/owner/company-wo/pages/company-report-wo"),
);
const ViewStaff = lazyWithRetry(
	() => import("@/features/owner/staff-master/pages/view-staff"),
);
const HistoryStaffInvitations = lazyWithRetry(
	() => import("@/features/owner/staff-master/pages/history-staff-invitations"),
);
const ViewMemberCodes = lazyWithRetry(
	() => import("@/features/owner/membercodes/pages/view-membercode"),
);
const WoServicesList = lazyWithRetry(
	() => import("@/features/owner/wo-create/pages/services-list"),
);
const WoServicesDetail = lazyWithRetry(
	() => import("@/features/owner/wo-create/pages/services-detail"),
);
const ViewFaq = lazyWithRetry(() => import("@/features/owner/faqs/pages/view-faq"));
const ViewPricePage = lazyWithRetry(
	() => import("@/features/owner/pricing/pages/view-price"),
);
const ViewAccountPairing = lazyWithRetry(
	() => import("@/features/owner/pairing-company/pages/view-account-pairing"),
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
		path: "positions/:id",
		element: <DetailDepartementPage />,
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
		path: "faqs",
		element: <ViewFaq />,
	},
	{
		path: "pricing",
		element: <ViewPricePage />,
	},
	{
		path: "account-pairing",
		element: <ViewAccountPairing />,
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
