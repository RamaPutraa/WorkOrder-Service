"use client";

import * as React from "react";
import {
	Briefcase,
	Building2,
	ClipboardList,
	ClipboardPenLine,
	FolderKanban,
	GalleryVerticalEnd,
	Home,
	IdCard,
	Inbox,
	LayoutDashboard,
	MonitorCog,
	Send,
	Ticket,
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
import useAuth from "@/features/auth/hooks/useAuth";
import { NavInternalBusiness } from "../molecules/nav-internal-business";
import { NavStaffBusiness } from "../molecules/nav-menu-staff";
import { redirectToRoleDashboard } from "@/lib/auth-helpers";

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
			url: "/dashboard/internal/faqs",
			icon: FolderKanban,
		},
		{
			title: "Tugas Kerja",
			url: "#",
			icon: MonitorCog,
			items: [
				{
					title: "Template",
					url: "/dashboard/internal/services/create/company-type",
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
			icon: IdCard,
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
		{
			title: "Kode Berlangganan",
			url: "/dashboard/internal/membercodes",
			icon: Ticket,
		},
	],
	navBusiness: [
		{
			title: "Daftar Perusahaan",
			url: "/dashboard/client/companies",
			icon: Building2,
		},
		{
			title: "Riwayat Permintaan",
			url: "/dashboard/client/submissions",
			icon: Send,
		},
	],
	navMenu: [
		{
			name: "Home",
			url: "/",
			icon: Home,
		},
		{
			name: "Dashboard",
			url: "/dashboard/internal",
			icon: LayoutDashboard,
		},
	],

	navInternalBusiness: [
		{
			title: "Daftar Layanan",
			url: "/dashboard/internal/wo-create/services",
			icon: ClipboardList,
		},
		{
			title: "Daftar Permintaan ",
			url: "/dashboard/internal/business/services/request",
			icon: Send,
		},
		{
			title: "Daftar Tugas Kerja",
			url: "/dashboard/internal/workorders",
			icon: ClipboardPenLine,
		},
	],
	navStaffBusiness: [
		{
			title: "Undangan Perusahaan",
			url: "/dashboard/unassigned/invitations-history",
			icon: Inbox,
		},

		{
			title: "Layanan Perusahaan",
			url: "#",
			icon: ClipboardList,
			items: [
				{
					title: "Daftar Layanan",
					url: "/dashboard/staff/services",
				},
				{
					title: "Riwayat Permintaan",
					url: "/dashboard/staff/services-request/history",
				},
			],
		},
		{
			title: "Daftar Tugas Kerja",
			url: "/dashboard/internal/workorders",
			icon: ClipboardPenLine,
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

	const roleDashboardUrl = user ? redirectToRoleDashboard(user.role) : "/";
	const currentNavMenu = [
		{
			name: "Home",
			url: "/",
			icon: Home,
		},
		{
			name: "Dashboard",
			url: roleDashboardUrl,
			icon: LayoutDashboard,
		},
	];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{!isSimpleRole ?
					<WorkOrderLogo />
				:	<TeamManagement teams={data.teams} />}
			</SidebarHeader>
			<SidebarContent>
				<NavMenu menu={currentNavMenu} />
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
					// set lock menu at nav-menu-staff.tsx
					<NavStaffBusiness items={data.navStaffBusiness} isUnassigned />
				)}
				{user && ["client"].includes(user.role) && (
					<NavBusiness items={data.navBusiness} />
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
