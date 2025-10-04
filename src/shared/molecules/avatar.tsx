import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/features/auth/hooks/useAuth";
import { useDialogStore } from "@/store/dialogStore";

const AvatarDropdown = () => {
	const { logout } = useAuth();
	const { showDialog } = useDialogStore();
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
					<DropdownMenuItem
						onClick={() =>
							showDialog({
								title: "Konfirmasi Logout",
								description: "Apakah kamu yakin ingin keluar dari aplikasi?",
								confirmText: "Logout",
								cancelText: "Batal",
								onConfirm: logout,
							})
						}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default AvatarDropdown;
