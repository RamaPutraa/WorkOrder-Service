import { Outlet } from "react-router-dom";
import Navbar from "../organism/navbar";

const PublicLayout = () => {
	return (
		<>
			<div className="min-h-screen flex flex-col">
				<Navbar showMenu />
				<main className="p-4">
					<Outlet />
				</main>
				<footer className="p-4 bg-gray-200 text-center"> Setiawan </footer>
			</div>
		</>
	);
};

export default PublicLayout;
