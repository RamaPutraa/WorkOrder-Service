import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AvatarDropdown = () => {
	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="cursor-pointer">
						{/* Avatar image */}
						<AvatarImage src="https://i.pravatar.cc/40" alt="User" />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => console.log("Profile clicked")}>
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => console.log("Settings clicked")}>
						Settings
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => console.log("Logout clicked")}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default AvatarDropdown;
