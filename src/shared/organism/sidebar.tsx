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
			title: "Tugas Kerja",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Template",
					url: "/dashboard/owner/services",
				},
				{
					title: "Kelola Layanan",
					url: "/dashboard/owner/services",
				},
				{
					title: "Kelola Formulir",
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
					title: "Pegawai (Aktif)",
					url: "#",
				},
				{
					title: "Pegawai (Menunggu)",
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
					title: "Daftar Layanan",
					url: "#",
				},
			],
		},
		{
			title: "Tugas Kerja",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Permintaan Layanan",
					url: "/dashboard/client/submissions",
				},
				{
					title: "Laporan Layanan",
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
			name: "Dokumentasi",
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
					url: "/dashboard/owner/business/services/request",
				},
				{
					title: "Riwayat Layanan",
					url: "#",
				},
				// {
				// 	title: "Riwayat Undangan Pegawai",
				// 	url: "#",
				// },
				// {
				// 	title: "Pelanggan",
				// 	url: "#",
				// },
			],
		},
		{
			title: "Tugas Kerja",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Daftar Tugas Kerja",
					url: "/dashboard/owner/workorders",
				},
				{
					title: "Riwayat Tugas Kerja",
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
