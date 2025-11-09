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
	SquareTerminal,
} from "lucide-react";

import { NavSetup } from "../molecules/nav-setup";
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
import { NavBusiness } from "../molecules/nav-business";

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
	navSetup: [
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "FAQ",
					url: "#",
				},
				{
					title: "Work Order",
					url: "#",
				},
				{
					title: "Custom WO",
					url: "#",
				},
			],
		},
		{
			title: "FAQ",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Kelola FAQ",
					url: "/dashboard/owner/services",
				},
				{
					title: "Kelola Form",
					url: "/dashboard/owner/forms",
				},
			],
		},
		{
			title: "Work Order",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Template",
					url: "/dashboard/owner/services",
				},
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
	],
	navBusiness: [
		{
			title: "Work Order",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "FAQ",
					url: "#",
				},
				{
					title: "Work Order",
					url: "#",
				},
				{
					title: "Custom WO",
					url: "#",
				},
			],
		},
		{
			title: "Transaksi",
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
				<NavSetup items={data.navSetup} />
				<NavBusiness items={data.navBusiness} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
