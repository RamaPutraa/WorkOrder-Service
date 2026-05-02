import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const LandingPage = lazy(() => import("@/features/public/landing-page"));
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const HeroRegis = lazy(
	() => import("@/features/auth/pages/hero-section-regis"),
);
const ClientRegisterPage = lazy(
	() => import("@/features/auth/pages/client-reg-page"),
);
const InternalRegisterPage = lazy(
	() => import("@/features/auth/pages/internal-reg-page"),
);

export const publicRoutes: RouteObject[] = [
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/hero-regis",
		element: <HeroRegis />,
	},
];

export const authRoutes: RouteObject[] = [
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
];
