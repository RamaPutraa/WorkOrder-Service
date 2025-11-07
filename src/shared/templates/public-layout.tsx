import { Outlet } from "react-router-dom";
import Navbar from "../organism/navbar";
import Footer from "../organism/footer";

const PublicLayout = () => {
	return (
		<>
			<div className="min-h-screen flex flex-col">
				<Navbar showMenu />
				<main>
					<Outlet />
				</main>
				<Footer />
			</div>
		</>
	);
};

export default PublicLayout;
