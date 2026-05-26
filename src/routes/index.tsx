import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AppLayout, PublicLayout, RootLayout } from "@/shared/templates";
import { SectionLoading } from "@/shared/atoms/loading-state";

// Guard Components
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Route Modules
import { internalRoutes } from "./modules/internal";
import { staffRoutes, unassignedRoutes } from "./modules/staff";
import { clientRoutes } from "./modules/client";
import { publicRoutes, authRoutes } from "./modules/public";
import { accountRoutes } from "./modules/account";

// Shared Lazy Components
const ErrorPage = lazy(() => import("@/shared/errors/templates/error-page"));
const NotFoundPage = lazy(
	() => import("@/shared/errors/templates/not-found-page"),
);
const DashboardManager = lazy(
	() => import("@/features/dashboard/pages/dashboard-manager"),
);

/**
 * Loading wrapper for lazy-loaded routes
 */
const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<SectionLoading message="Memuat Halaman..." />}>
		{children}
	</Suspense>
);
// TODO: error page dan maintenance page
const router = createBrowserRouter([
	// ── Internal Dashboard (Owner, Manager, Staff Company) ──
	{
		path: "/dashboard/internal",
		element: (
			<ProtectedRoute
				allowedRoles={["owner_company", "manager_company", "staff_company"]}
			/>
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [
					{
						element: (
							<SuspenseLayout>
								<ProtectedRoute
									allowedRoles={[
										"owner_company",
										"manager_company",
										"staff_company",
									]}
								/>
							</SuspenseLayout>
						),
						children: internalRoutes,
					},
				],
			},
		],
	},

	// ── Manager Dashboard ──
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
						element: (
							<SuspenseLayout>
								<DashboardManager />
							</SuspenseLayout>
						),
					},
				],
			},
		],
	},

	// ── Staff Dashboard ──
	{
		path: "/dashboard/staff",
		element: <ProtectedRoute allowedRoles={["staff_company"]} />,
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [
					{
						element: (
							<SuspenseLayout>
								<ProtectedRoute allowedRoles={["staff_company"]} />
							</SuspenseLayout>
						),
						children: staffRoutes,
					},
				],
			},
		],
	},

	// ── Unassigned Staff Dashboard ──
	{
		path: "/dashboard/unassigned",
		element: (
			<ProtectedRoute allowedRoles={["staff_unassigned", "staff_company"]} />
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
		children: [
			{
				element: (
					<RootLayout>
						<AppLayout />
					</RootLayout>
				),
				children: [
					{
						element: (
							<SuspenseLayout>
								<ProtectedRoute
									allowedRoles={["staff_unassigned", "staff_company"]}
								/>
							</SuspenseLayout>
						),
						children: unassignedRoutes,
					},
				],
			},
		],
	},

	// ── Client Dashboard ──
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
						element: (
							<SuspenseLayout>
								<ProtectedRoute allowedRoles={["client"]} />
							</SuspenseLayout>
						),
						children: clientRoutes,
					},
				],
			},
		],
	},

	// ── Auth Routes (Guest Only) ──
	{
		element: <GuestRoute />,
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
		children: [
			{
				element: (
					<RootLayout>
						<PublicLayout />
					</RootLayout>
				),
				children: [
					{
						element: (
							<SuspenseLayout>
								<GuestRoute />
							</SuspenseLayout>
						),
						children: authRoutes,
					},
				],
			},
		],
	},

	// ── Public Routes ──
	{
		element: (
			<RootLayout>
				<PublicLayout />
			</RootLayout>
		),
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
		children: [
			{
				element: (
					<SuspenseLayout>
						<Outlet />
					</SuspenseLayout>
				),
				children: publicRoutes,
			},
		],
	},

	// ── Shared Account Routes (Profile & Settings) ──
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
		errorElement: (
			<SuspenseLayout>
				<ErrorPage />
			</SuspenseLayout>
		),
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
						element: (
							<SuspenseLayout>
								<ProtectedRoute
									allowedRoles={[
										"owner_company",
										"manager_company",
										"staff_company",
										"staff_unassigned",
										"client",
									]}
								/>
							</SuspenseLayout>
						),
						children: accountRoutes,
					},
				],
			},
		],
	},

	// ── Fallback ──
	{
		path: "*",
		element: (
			<SuspenseLayout>
				<NotFoundPage />
			</SuspenseLayout>
		),
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
