"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Settings,
	Sparkles,
	User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import useAuth from "@/features/auth/hooks/useAuth";
import { useDialogStore } from "@/store/dialogStore";
import { useNavigate } from "react-router-dom";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, logout, isAuthenticated } = useAuth();
	const { showDialog } = useDialogStore();
	const navigate = useNavigate();

	// jika user belum login, tidak tampilkan apapun
	if (!isAuthenticated || !user) return null;

	const userName = user?.name || "User";
	const userEmail = user?.email || "no-email@example.com";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="h-8 w-8 rounded-lg">
								{/* <AvatarImage src={userAvatar} alt={userName} /> */}
								<AvatarFallback className="rounded-lg">
									{userName[0]?.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{userName}</span>
								<span className="truncate text-xs">{userEmail}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					{/* Dropdown content */}
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{/* <AvatarImage src={userAvatar} alt={userName} /> */}
									<AvatarFallback className="rounded-lg">
										{userName[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{userName}</span>
									<span className="truncate text-xs">{userEmail}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => navigate("/dashboard/account")}>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Pengaturan
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						{/* Logout dengan dialog konfirmasi */}
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
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
