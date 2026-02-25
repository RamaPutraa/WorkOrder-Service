import { Outlet } from "react-router-dom";
import Navbar from "../organism/navbar";
import Footer from "../organism/footer";

const PublicLayout = () => {
	return (
		<>
			<div className="min-h-screen flex flex-col">
				<Navbar showMenu />
				{/* pt-16 mengimbangi tinggi navbar fixed (h-16 = 64px) */}
				<main className="flex-1 pt-16">
					<Outlet />
				</main>
				<Footer />
			</div>
		</>
	);
};

export default PublicLayout;
