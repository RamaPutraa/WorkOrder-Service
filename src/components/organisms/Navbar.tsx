import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import ToogleTheme from "../molecules/ToggleTheme";
import AvatarDropdown from "../molecules/Avatar";

const Navbar = () => {
	return (
		<header className="flex items-center justify-between px-6 h-16 border-b bg-background shadow-sm">
			{/* Left section */}
			<div className="flex items-center gap-3">
				<SidebarTrigger />
				<h2 className="font-bold text-xl">Dashboard</h2>
			</div>

			{/* Right section */}
			<div className="flex items-center gap-4">
				{/* Dark/Light toggle */}
				<ToogleTheme />
				<AvatarDropdown />
			</div>
		</header>
	);
};

export default Navbar;
