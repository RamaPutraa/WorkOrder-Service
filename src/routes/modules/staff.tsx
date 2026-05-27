import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { type RouteObject } from "react-router-dom";

const DashboardStaff = lazyWithRetry(
	() => import("@/features/dashboard/pages/dashboard-staff"),
);

const ListServices = lazyWithRetry(
	() => import("@/features/staff/service-request/pages/list-services"),
);
const ServiceForm = lazyWithRetry(
	() => import("@/features/staff/service-request/pages/services-form"),
);
const SrHistory = lazyWithRetry(
	() => import("@/features/staff/service-request/pages/sr-history"),
);
const SrDetailHistory = lazyWithRetry(
	() => import("@/features/staff/service-request/pages/sr-detail-history"),
);
const InvitationsHistory = lazyWithRetry(
	() => import("@/features/staff/invitations/pages/invitations-history"),
);

export const staffRoutes: RouteObject[] = [
	{
		path: "",
		element: <DashboardStaff />,
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
