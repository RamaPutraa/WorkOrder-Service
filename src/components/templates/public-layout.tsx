import { Outlet } from "react-router-dom";

const PublicLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 p-4">
				<Outlet />
			</main>
			<footer className="p-4 bg-gray-200 text-center"> Setiawan </footer>
		</div>
	);
};

export default PublicLayout;
