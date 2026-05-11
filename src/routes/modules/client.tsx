import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const DashboardClient = lazy(
	() => import("@/features/dashboard/pages/dashboard-client"),
);
const CompanyList = lazy(
	() => import("@/features/client/company/pages/company-list"),
);
const ClientCompanyServices = lazy(
	() => import("@/features/client/company/pages/company-services"),
);
const PublicServicePage = lazy(
	() => import("@/features/client/services-wo/pages/service-request"),
);
const ServiceSubmitPage = lazy(
	() => import("@/features/client/services-wo/pages/services-submit"),
);
const ServiceDetailSubmit = lazy(
	() => import("@/features/client/services-wo/pages/services-detail-submit"),
);

export const clientRoutes: RouteObject[] = [
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
		path: "submissions",
		element: <ServiceSubmitPage />,
	},
	{
		path: "submissions/:id",
		element: <ServiceDetailSubmit />,
	},
];
