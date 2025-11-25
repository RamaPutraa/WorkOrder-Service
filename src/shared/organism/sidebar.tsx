"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
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
import { NavHelp } from "../molecules/nav-help";
import useAuth from "@/features/auth/hooks/useAuth";
import { NavInternalBusiness } from "../molecules/nav-internal-business";

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
			title: "Perusahaan",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Daftar Perusahaan",
					url: "/dashboard/client/submissions",
				},
				{
					title: "Daftar Service",
					url: "#",
				},
			],
		},
		{
			title: "Work Order",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Request Service",
					url: "/dashboard/client/submissions",
				},
				{
					title: "Report Service",
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
					title: "example",
					url: "#",
				},
				{
					title: "example",
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
			url: "/dashboard/client",
			icon: PieChart,
		},
	],
	navHelp: [
		{
			name: "Documentation",
			url: "/",
			icon: BookOpen,
		},
		{
			name: "Setting",
			url: "#",
			icon: PieChart,
		},
	],
	navInternalBusiness: [
		{
			title: "Permintaan Pelanggan",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Layanan",
					url: "/dashboard/owner/business/services/request",
				},
				{
					title: "Pertanyaan",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth();
	const isCompanyUser = [
		"owner_company",
		"manager_company",
		"staff_company",
	].includes(user?.role || "");

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamManagement teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMenu menu={data.navMenu} />
				{isCompanyUser && (
					<>
						<NavSetup items={data.navSetup} />
						<NavInternalBusiness items={data.navInternalBusiness} />
					</>
				)}
				{user && ["client"].includes(user.role) && (
					<NavBusiness items={data.navBusiness} />
				)}
				<NavHelp help={data.navHelp} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
