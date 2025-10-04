import ToogleTheme from "../molecules/toggle-theme";
import AvatarDropdown from "../molecules/avatar";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	// NavigationMenuTrigger,
	// NavigationMenuContent,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";

type NavbarProps = {
	showMenu?: boolean;
};

const Navbar = ({ showMenu = false }: NavbarProps) => {
	return (
		<header className="flex items-center justify-between px-6 h-18 border-b bg-background shadow-sm">
			{/* Left section */}
			<div className="flex items-center gap-3">
				<h2 className=" text-xl">WorkOrder</h2>
			</div>
			{showMenu && (
				<div className="flex items-center">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink href="/" className="px-3 py-2">
									Home
								</NavigationMenuLink>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<NavigationMenuLink href="/about" className="px-3 py-2">
									About
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								{/* <NavigationMenuLink href="/about" className="px-3 py-2">
									Contact Us
								</NavigationMenuLink> */}
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			)}

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
