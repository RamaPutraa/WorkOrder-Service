// import ToogleTheme from "../molecules/toggle-theme";
import AvatarDropdown from "../molecules/avatar";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	// NavigationMenuTrigger,
	// NavigationMenuContent,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import useAuth from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";

type NavbarProps = {
	showMenu?: boolean;
};

const Navbar = ({ showMenu = false }: NavbarProps) => {
	const { user } = useAuth();
	return (
		<header className="bg-primary text-background px-6 ">
			{/* Left section */}
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-semibold">
				<div className="flex items-center gap-3">
					<h2 className=" text-2xl">WorkOrder</h2>
					{showMenu && (
						<div className="flex items-center">
							<NavigationMenu>
								<NavigationMenuList>
									<NavigationMenuItem>
										<NavigationMenuLink href="/" className="px-3 py-2 text-md">
											Home
										</NavigationMenuLink>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<NavigationMenuLink
											href="/about"
											className="px-3 py-2 text-md">
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
				</div>

				{/* Right section */}
				<div className="flex items-center gap-4">
					{/* <ToogleTheme /> */}

					{user ? (
						<AvatarDropdown />
					) : (
						<div className="flex gap-2">
							<Button asChild size="lg" className="font-semibold">
								<a href="/login">Login</a>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="bg-transparent font-semibold border-yellow-2-500 hover:bg-yellow-500">
								<a href="/register">Register</a>
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
