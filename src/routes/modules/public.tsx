import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { type RouteObject } from "react-router-dom";

const LandingPage = lazyWithRetry(() => import("@/features/public/landing-page"));
const LoginPage = lazyWithRetry(() => import("@/features/auth/pages/login-page"));
const HeroRegis = lazyWithRetry(
	() => import("@/features/auth/pages/hero-section-regis"),
);
const ClientRegisterPage = lazyWithRetry(
	() => import("@/features/auth/pages/client-reg-page"),
);
const InternalRegisterPage = lazyWithRetry(
	() => import("@/features/auth/pages/internal-reg-page"),
);
const MockExternalAuth = lazyWithRetry(
	() => import("@/features/client/pairing-account/pages/mock-external-auth")
);
const VerifyOtpPage = lazyWithRetry(
	() => import("@/features/auth/pages/verify-otp-page"),
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
	{
		path: "/mock-external-auth",
		element: <MockExternalAuth />,
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
	{
		path: "/verify-otp",
		element: <VerifyOtpPage />,
	},
];

