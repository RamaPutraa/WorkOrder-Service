import { useState, useEffect } from "react";
import AvatarDropdown from "../molecules/avatar";
import useAuth from "@/features/auth/hooks/useAuth";
import { Menu, X, LayoutDashboard } from "lucide-react";
import woLogo from "@/assets/wo-logo-vector.svg";
import { Link } from "react-router-dom";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

type NavbarProps = {
	showMenu?: boolean;
};

const Navbar = ({ showMenu = false }: NavbarProps) => {
	const { user } = useAuth();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ?
				"bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 py-2"
				: "bg-transparent py-4"
				}`}>
			<div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2 group">
					<img src={woLogo} alt="Work Order" className="w-7 h-7 object-contain pr-1" />
					<span className="font-semibold text-gray-900 text-xl tracking-tight">
						Work Order
					</span>
				</Link>

				{/* Right Actions */}
				<div className="flex items-center gap-4">
					<Link
						to={user?.role ? redirectToRoleDashboard(user.role) : "/login"}
						className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all rounded-full hover:bg-gray-100/50">
						<LayoutDashboard size={16} />
						Dashboard
					</Link>

					{user ?
						<AvatarDropdown />
						: <div className="hidden md:flex items-center gap-2">
							<Link
								to="/login"
								className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100/50">
								Masuk
							</Link>
							<Link
								to="/hero-regis"
								className="px-5 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all shadow-sm">
								Daftar
							</Link>
						</div>
					}

					{/* Mobile Menu Toggle */}
					{showMenu && (
						<button
							className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full transition-all"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label="Toggle menu">
							{mobileOpen ?
								<X size={20} />
								: <Menu size={20} />}
						</button>
					)}
				</div>
			</div>

			{/* Mobile Menu */}
			{showMenu && mobileOpen && (
				<div className="md:hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-md px-6 py-4 space-y-2 mt-4">
					<Link
						to={user?.role ? redirectToRoleDashboard(user.role) : "/login"}
						className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
						<LayoutDashboard size={18} />
						Dashboard
					</Link>

					{!user && (
						<div className="pt-2 border-t border-gray-100/50 mt-2 flex flex-col gap-2">
							<Link
								to="/login"
								className="block text-center px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
								Masuk
							</Link>
							<Link
								to="/hero-regis"
								className="block text-center px-4 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all shadow-sm">
								Daftar Sekarang
							</Link>
						</div>
					)}
				</div>
			)}
		</header>
	);
};

export default Navbar;
