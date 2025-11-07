"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "../molecules/nav-main";
import { NavUser } from "../molecules/nav-user";
import { NavMenu } from "../molecules/nav-menu";
import { TeamManagement } from "../molecules/nav-header";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Services",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Kelola Service",
					url: "/dashboard/owner/services",
				},
				{
					title: "Kelola Form",
					url: "/dashboard/owner/forms",
				},
			],
		},
		{
			title: "Pegawai",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Pegawai (Active)",
					url: "#",
				},
				{
					title: "Pegawai (Pending)",
					url: "#",
				},
				{
					title: "Posisi Pegawai",
					url: "/dashboard/owner/positions",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	navMenu: [
		{
			name: "Beranda",
			url: "/",
			icon: Frame,
		},
		{
			name: "Statistik Perusahaan",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamManagement teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMenu menu={data.navMenu} />
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
