import { lazyWithRetry } from "@/shared/utils/lazy-with-retry";
import { type RouteObject } from "react-router-dom";

const ProfilePage = lazyWithRetry(() => import("@/features/auth/pages/profile"));
const SettingsPage = lazyWithRetry(
	() => import("@/features/settings/pages/settings-page"),
);

export const accountRoutes: RouteObject[] = [
	{
		path: "",
		element: <ProfilePage />,
	},
	{
		path: "settings",
		element: <SettingsPage />,
	},
];
