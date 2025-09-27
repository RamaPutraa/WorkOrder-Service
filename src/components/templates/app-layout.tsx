import { Outlet } from "react-router-dom";
import AppSidebar from "../organisms/Sidebar";
import { SidebarProvider } from "../ui/sidebar";
import Navbar from "../organisms/Navbar";

const AppLayout = () => {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-screen">
				<AppSidebar />
				<div className="flex flex-col flex-1 ">
					{/* Navbar */}
					<Navbar />
					{/* Main content */}
					<main className="flex-1 p-4">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default AppLayout;
