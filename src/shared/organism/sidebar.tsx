"use client";

import * as React from "react";
import {
	BookOpen,
	Bot,
	Briefcase,
	Frame,
	GalleryVerticalEnd,
	PieChart,
	SquareTerminal,
} from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

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
import { NavStaffBusiness } from "../molecules/nav-menu-staff";

// This is sample data.
const data = {
	teams: [
		{
			name: "Profil Perusahaan",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
			url: "/dashboard/internal/company",
		},
	],
	navSetup: [
		{
			title: "Kelola FAQ",
			url: "",
			icon: BookOpen,
		},

		{
			title: "Tugas Kerja",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Template",
					url: "/dashboard/internal/services",
				},
				{
					title: "Kelola Formulir",
					url: "/dashboard/internal/forms",
				},
				{
					title: "Kelola Layanan",
					url: "/dashboard/internal/services",
				},
			],
		},
		{
			title: "Kepegawaian",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Departemen",
					url: "/dashboard/internal/positions",
				},
				{
					title: "Pegawai Perusahaan",
					url: "/dashboard/internal/staff",
				},
				{
					title: "Riwayat Undangan",
					url: "/dashboard/internal/staff/history-invitations",
				},
			],
		},
	],
	navBusiness: [
		{
			title: "Daftar Perusahaan",
			url: "/dashboard/client/companies",
			icon: BookOpen,
		},
		{
			title: "Daftar Layanan",
			url: "/dashboard/client/services",
			icon: BookOpen,
		},
		{
			title: "Permintaan Layanan",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Riwayat Permintaan",
					url: "/dashboard/client/submissions",
				},
				{
					title: "Pelaporan",
					url: "/dashboard/client/reports",
				},
			],
		},
	],
	navMenu: [
		{
			name: "Home",
			url: "/",
			icon: Frame,
		},
		{
			name: "Dashboard",
			url: "/dashboard/client",
			icon: PieChart,
		},
	],
	navHelp: [
		{
			name: "Bantuan",
			url: "/",
			icon: BookOpen,
		},
		{
			name: "Pengaturan",
			url: "#",
			icon: PieChart,
		},
	],
	navInternalBusiness: [
		{
			title: "Permintaan Layanan",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Daftar Layanan",
					url: "/dashboard/internal/business/services/request",
				},
				{
					title: "Riwayat Layanan",
					url: "#",
				},
			],
		},
		{
			title: "Tugas Kerja",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Daftar Tugas Kerja",
					url: "/dashboard/internal/workorders",
				},
				{
					title: "Riwayat Tugas Kerja",
					url: "#",
				},
			],
		},
	],
	navStaffBusiness: [
		{
			title: "Undangan Perusahaan",
			url: "/dashboard/unassigned/invitations-history",
			icon: PieChart,
		},
		{
			title: "Rekan Kerja",
			url: "/dashboard/client/companies",
			icon: BookOpen,
		},
		{
			title: "Perintah Kerja",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Tugas Kerja",
					url: "/dashboard/internal/workorders",
				},
				{
					title: "Riwayat Tugas Kerja",
					url: "/dashboard/client/reports",
				},
			],
		},
	],
};

// Header sederhana untuk role yang belum/tidak tergabung dalam perusahaan
function WorkOrderLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="pointer-events-none select-none">
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						<Briefcase className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">Work Order</span>
						<span className="truncate text-xs text-muted-foreground">
							Manajemen Work Order
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth();

	const isSimpleRole = user?.role === "owner_company";

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{!isSimpleRole ?
					<WorkOrderLogo />
				:	<TeamManagement teams={data.teams} />}
			</SidebarHeader>
			<SidebarContent>
				<NavMenu menu={data.navMenu} />
				{user && ["owner_company"].includes(user.role) && (
					<>
						<NavSetup items={data.navSetup} />
						<NavInternalBusiness items={data.navInternalBusiness} />
					</>
				)}
				{user && ["manager_company"].includes(user.role) && (
					<NavInternalBusiness items={data.navInternalBusiness} />
				)}
				{user && ["staff_company"].includes(user.role) && (
					<NavStaffBusiness items={data.navStaffBusiness} />
				)}
				{user && ["staff_unassigned"].includes(user.role) && (
					<NavStaffBusiness items={data.navStaffBusiness} isUnassigned />
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
