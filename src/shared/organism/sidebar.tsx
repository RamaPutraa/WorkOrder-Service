import {
	Home,
	Inbox,
	Search,
	Settings,
	User,
	PlusCircle,
	List,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@radix-ui/react-collapsible";

const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarContent>
				{/* ====== Application Group ====== */}
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Home */}
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a href="/dashboard/owner">
										<Home className="w-4 h-4" />
										<span>Home</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* ====== Form ====== */}
							<Collapsible defaultOpen>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<Inbox className="w-4 h-4" />
										<span>Form</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenu className="pl-6 mt-1 space-y-1">
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/forms">
													<List className="w-4 h-4" />
													<span>Lihat Form</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/form/create">
													<PlusCircle className="w-4 h-4" />
													<span>Tambah Form</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</CollapsibleContent>
							</Collapsible>

							{/* ====== Pegawai ====== */}
							<Collapsible>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<User className="w-4 h-4" />
										<span>Pegawai</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenu className="pl-6 mt-1 space-y-1">
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/pegawai">
													<List className="w-4 h-4" />
													<span>Lihat Pegawai</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/pegawai/create">
													<PlusCircle className="w-4 h-4" />
													<span>Tambah Pegawai</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</CollapsibleContent>
							</Collapsible>

							{/* ====== Posisi ====== */}
							<Collapsible>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<Search className="w-4 h-4" />
										<span>Posisi</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenu className="pl-6 mt-1 space-y-1">
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/positions">
													<List className="w-4 h-4" />
													<span>Lihat Posisi</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/posisi/create">
													<PlusCircle className="w-4 h-4" />
													<span>Tambah Posisi</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</CollapsibleContent>
							</Collapsible>

							{/* ====== Settings ====== */}
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a href="#">
										<Settings className="w-4 h-4" />
										<span>Settings</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
