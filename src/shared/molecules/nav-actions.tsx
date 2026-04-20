"use client";

import * as React from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { CheckCircle2, Info, AlertTriangle, Check, Bell } from "lucide-react";

// --- Data Dummy (Bisa Anda ganti dengan data dari API/FCM) ---
const MOCK_NOTIFICATIONS = [
	{
		id: "1",
		title: "Perintah Kerja Baru!",
		message: "Anda telah ditugaskan untuk WO-99812 (Pemasangan AC).",
		time: "5 mnt lalu",
		isUnread: true,
		type: "info", // info, success, warning
	},
	{
		id: "2",
		title: "Work Order Selesai",
		message: "WO-99810 telah diselesaikan dan menunggu persetujuan Anda.",
		time: "2 jam lalu",
		isUnread: false,
		type: "success",
	},
	{
		id: "3",
		title: "Perubahan Status",
		message: "Work Order WO-99805 telah dibatalkan oleh Admin.",
		time: "1 hari lalu",
		isUnread: false,
		type: "warning",
	},
];

// --- Helper untuk Icon ---
const getNotificationIcon = (type: string) => {
	switch (type) {
		case "success":
			return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
		case "warning":
			return <AlertTriangle className="w-4 h-4 text-amber-600" />;
		default:
			return <Info className="w-4 h-4 text-blue-600" />;
	}
};

const getIconBg = (type: string) => {
	switch (type) {
		case "success":
			return "bg-emerald-100";
		case "warning":
			return "bg-amber-100";
		default:
			return "bg-blue-100";
	}
};

export function NavActions() {
	const [isOpen, setIsOpen] = React.useState(false);

	React.useEffect(() => {
		setIsOpen(true);
	}, []);

	return (
		<div className="flex items-center gap-2 text-sm mr-7">
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<div className="flex items-center gap-2 border border-primary/30 rounded-full px-3 py-1.5 hover:cursor-pointer hover:bg-muted transition-all">
						<div className="relative flex items-center justify-center">
							<Bell size={14} className="text-primary" strokeWidth={1.5} />
							{/* Indicator "Ping" Alert */}
							<span className="absolute -top-1 -right-0.5 flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
							</span>
						</div>
						<p className="text-xs font-semibold text-primary uppercase tracking-wide">
							Notifikasi
						</p>
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="w-97.5 overflow-hidden rounded-lg p-0"
					align="end">
					<Sidebar collapsible="none" className="bg-transparent">
						<SidebarContent>
							{/* Header Notifikasi */}
							<div className="flex items-center justify-between px-4 py-4 border-b border-border">
								<div className="flex items-center gap-2">
									{/* Badge jumlah unread */}
									<span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full">
										1
									</span>
									<h2 className="text-xs font-semibold text-foreground">
										Notifikasi belum terbaca
									</h2>
								</div>
								<button className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
									<Check className="w-3 h-3" />
									Tandai dibaca
								</button>
							</div>

							{/* List Notifikasi (Bisa di-scroll) */}
							<div className="flex-1 overflow-y-auto p-2 space-y-1">
								{MOCK_NOTIFICATIONS.map((notif) => (
									<div
										key={notif.id}
										className={`group relative flex items-start gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer ${
											notif.isUnread ? "bg-primary/5" : "bg-transparent"
										}`}>
										{/* Indikator Unread (Titik Biru di Kiri) */}
										{notif.isUnread && (
											<div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
										)}

										{/* Icon Container */}
										<div
											className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-0.5 ${getIconBg(notif.type)}`}>
											{getNotificationIcon(notif.type)}
										</div>

										{/* Konten Text */}
										<div className="flex flex-col flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2 mb-1">
												<span
													className={`text-sm truncate ${notif.isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
													{notif.title}
												</span>
												<span className="text-[10px] whitespace-nowrap text-muted-foreground mt-0.5">
													{notif.time}
												</span>
											</div>
											<p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
												{notif.message}
											</p>
										</div>
									</div>
								))}

								{/* State Kosong (Jika tidak ada notif) */}
								{/* <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                    <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium text-foreground/70">Belum ada notifikasi</p>
                    <p className="text-xs text-muted-foreground mt-1">Pesan baru akan muncul di sini.</p>
                </div> 
                */}
							</div>
						</SidebarContent>
					</Sidebar>
				</PopoverContent>
			</Popover>
		</div>
	);
}
