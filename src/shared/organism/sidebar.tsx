import { Home, Inbox, Settings, List } from "lucide-react";

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

							{/* ====== Work Order ====== */}
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<a href="#">
										<Settings className="w-4 h-4" />
										<span>Work Order</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* ====== Master Data ====== */}
							<Collapsible defaultOpen>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<Inbox className="w-4 h-4" />
										<span>Master Data</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenu className="pl-6 mt-1 space-y-1">
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/company">
													<List className="w-4 h-4" />
													<span>Company</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/positions">
													<List className="w-4 h-4" />
													<span>Position</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/forms">
													<List className="w-4 h-4" />
													<span>Form</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/form/create">
													<List className="w-4 h-4" />
													<span>Service</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<a href="/dashboard/owner/services">
													<List className="w-4 h-4" />
													<span>Work Order</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</CollapsibleContent>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
