import { Outlet } from "react-router-dom";
import AppSidebar from "../molecules/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const AppLayout = () => {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen">
				<AppSidebar />
				<main className="flex-1 p-4">
					<SidebarTrigger />
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
};

export default AppLayout;
