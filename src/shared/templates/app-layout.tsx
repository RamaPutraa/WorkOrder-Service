import { Outlet } from "react-router-dom";
import AppSidebar from "../organism/sidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import Navbar from "../organism/navbar";

const AppLayout = () => {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-screen">
				<AppSidebar />
				<div className="flex flex-col flex-1 ">
					{/* Navbar */}
					<Navbar />
					{/* Main content */}
					<main className="flex-1 px-20 py-5 mt-10">
						<Outlet />
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default AppLayout;
