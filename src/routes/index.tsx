import { AppLayout, AuthLayout, RootLayout } from "@/components/templates";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Dashboard from "@/pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	{
		element: (
			<RootLayout>
				<AppLayout />
			</RootLayout>
		),
		children: [
			{
				path: "/",
				element: <Dashboard />,
			},
		],
	},
	{
		element: (
			<RootLayout>
				<AuthLayout />
			</RootLayout>
		),
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/register",
				element: <RegisterPage />,
			},
		],
	},
]);

export default function AppRoutes() {
	return <RouterProvider router={router} />;
}
