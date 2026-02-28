"use client";

import { ChevronRight, Lock, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavStaffBusiness({
	items,
	isUnassigned,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	isUnassigned?: boolean;
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu Operasional</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isLocked =
						isUnassigned &&
						(item.title === "Rekan Kerja" || item.title === "Perintah Kerja");

					if (isLocked) {
						return (
							<HoverCard key={item.title}>
								<HoverCardTrigger asChild>
									<SidebarMenuItem>
										<SidebarMenuButton
											tooltip={item.title}
											className="opacity-50 hover:bg-transparent cursor-not-allowed">
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<Lock className="ml-auto w-4 h-4 text-muted-foreground" />
										</SidebarMenuButton>
									</SidebarMenuItem>
								</HoverCardTrigger>
								<HoverCardContent
									side="right"
									align="start"
									sideOffset={16}
									className="w-80 p-4 shadow-lg   bg-white rounded-xl">
									<div className="flex flex-col gap-2">
										<div className="flex items-center gap-2">
											<Lock className="w-4 h-4" />
											<span className="font-semibold text-sm">
												Akses Terkunci
											</span>
										</div>
										<p className="text-sm text-slate-600 leading-relaxed">
											Anda harus tergabung dalam sebuah perusahaan terlebih
											dahulu untuk mengakses menu{" "}
											<span className="font-semibold text-slate-800">
												{item.title}
											</span>
											.
										</p>
									</div>
								</HoverCardContent>
							</HoverCard>
						);
					}

					return item.items ?
							// Collapsible menu with dropdown
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a href={subItem.url}>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
							// Flat menu without dropdown
						:	<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild tooltip={item.title}>
									<a href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>;
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
