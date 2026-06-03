import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { LogOutIcon } from "lucide-react";

const AvatarDropdown = () => {
	const { user, logout } = useAuth();
	const { showDialog } = useDialogStore();
	const userName = user?.name || "User";

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center gap-2 cursor-pointer">
						<Avatar className="h-8 w-8 rounded-lg">
							{/* <AvatarImage src={userAvatar} alt={userName} /> */}
							<AvatarFallback className="rounded-lg">
								{userName[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						{/* Nama user */}
						<span className="text-sm font-medium">{user?.name || "User"}</span>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>

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
						<LogOutIcon />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default AvatarDropdown;
