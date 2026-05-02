import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const DashboardStaff = lazy(() => import("@/features/staff/dahsboard-staff"));
const SrConfirmation = lazy(
	() =>
		import("@/features/staff/service-request-confirmation/pages/sr-confirmation"),
);
const ListServices = lazy(
	() => import("@/features/staff/service-request/pages/list-services"),
);
const ServiceForm = lazy(
	() => import("@/features/staff/service-request/pages/services-form"),
);
const SrHistory = lazy(
	() => import("@/features/staff/service-request/pages/sr-history"),
);
const SrDetailHistory = lazy(
	() => import("@/features/staff/service-request/pages/sr-detail-history"),
);
const InvitationsHistory = lazy(
	() => import("@/features/staff/invitations/pages/invitations-history"),
);

export const staffRoutes: RouteObject[] = [
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
];

export const unassignedRoutes: RouteObject[] = [
	{
		path: "",
		element: <DashboardStaff />,
	},
	{
		path: "invitations-history",
		element: <InvitationsHistory />,
	},
];
