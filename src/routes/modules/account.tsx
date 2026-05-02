import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const ProfilePage = lazy(() => import("@/features/auth/pages/profile"));
const SettingsPage = lazy(
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
