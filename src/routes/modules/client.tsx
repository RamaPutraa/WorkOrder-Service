import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { type RouteObject } from "react-router-dom";

const DashboardClient = lazyWithRetry(
	() => import("@/features/dashboard/pages/dashboard-client"),
);
const CompanyList = lazyWithRetry(
	() => import("@/features/client/company/pages/company-list"),
);
const ClientCompanyServices = lazyWithRetry(
	() => import("@/features/client/company/pages/company-services"),
);
const PublicServicePage = lazyWithRetry(
	() => import("@/features/client/services-wo/pages/service-request"),
);
const ServiceSubmitPage = lazyWithRetry(
	() => import("@/features/client/services-wo/pages/services-submit"),
);
const ServiceDetailSubmit = lazyWithRetry(
	() => import("@/features/client/services-wo/pages/services-detail-submit"),
);
const PairingCallback = lazyWithRetry(
	() => import("@/features/client/pairing-account/pages/pairing-callback")
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
	{
		path: "pairing/callback",
		element: <PairingCallback />,
	},
];
