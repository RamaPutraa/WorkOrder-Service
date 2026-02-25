import { useState, useEffect } from "react";
import AvatarDropdown from "../molecules/avatar";
import useAuth from "@/features/auth/hooks/useAuth";
import { Menu, X } from "lucide-react";

type NavbarProps = {
	showMenu?: boolean;
};

const navLinks = [
	{ label: "Beranda", href: "/" },
	{ label: "Tentang", href: "/about" },
	{ label: "Kontak", href: "/contact" },
];

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
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled ?
					"bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100"
				:	"bg-white/80 backdrop-blur-sm"
			}`}>
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				{/* Logo */}
				<a href="/" className="flex items-center gap-2 group">
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
						<span className="text-white font-bold text-sm">W</span>
					</div>
					<span className="font-bold text-gray-900 text-lg tracking-tight">
						WorkOrder
					</span>
				</a>

				{/* Desktop Nav */}
				{showMenu && (
					<nav className="hidden md:flex items-center gap-1">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
								{link.label}
							</a>
						))}
					</nav>
				)}

				{/* Right Actions */}
				<div className="flex items-center gap-3">
					{user ?
						<AvatarDropdown />
					:	<div className="hidden md:flex items-center gap-2">
							<a
								href="/login/"
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
								Masuk
							</a>
							<a
								href="/register"
								className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
								Daftar
							</a>
						</div>
					}

					{/* Mobile Menu Toggle */}
					{showMenu && (
						<button
							className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label="Toggle menu">
							{mobileOpen ?
								<X size={20} />
							:	<Menu size={20} />}
						</button>
					)}
				</div>
			</div>

			{/* Mobile Menu */}
			{showMenu && mobileOpen && (
				<div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-md px-6 py-4 space-y-1">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
							onClick={() => setMobileOpen(false)}>
							{link.label}
						</a>
					))}
					{!user && (
						<div className="pt-3 border-t border-blue-100 mt-3 flex flex-col gap-2">
							<a
								href="/login/"
								className="block text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all">
								Masuk
							</a>
							<a
								href="/register"
								className="block text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm">
								Daftar Sekarang
							</a>
						</div>
					)}
				</div>
			)}
		</header>
	);
};

export default Navbar;
