"use client";

import * as React from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { CheckCircle2, Info, AlertTriangle, Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

// --- Helper: tentukan tipe visual dari isi notifikasi ---
const resolveType = (
	notif: AppNotification,
): "success" | "warning" | "info" => {
	const text = `${notif.title} ${notif.body}`.toLowerCase();
	if (
		text.includes("selesai") ||
		text.includes("disetujui") ||
		text.includes("approved") ||
		text.includes("complete")
	)
		return "success";
	if (
		text.includes("batal") ||
		text.includes("cancel") ||
		text.includes("ditolak") ||
		text.includes("rejected")
	)
		return "warning";
	return "info";
};

const getNotificationIcon = (type: "success" | "warning" | "info") => {
	switch (type) {
		case "success":
			return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
		case "warning":
			return <AlertTriangle className="w-4 h-4 text-amber-600" />;
		default:
			return <Info className="w-4 h-4 text-blue-600" />;
	}
};

const getIconBg = (type: "success" | "warning" | "info") => {
	switch (type) {
		case "success":
			return "bg-emerald-100";
		case "warning":
			return "bg-amber-100";
		default:
			return "bg-blue-100";
	}
};

// --- Skeleton Loading Item ---
const NotificationSkeleton = () => (
	<div className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
		<div className="shrink-0 w-8 h-8 rounded-full bg-muted mt-0.5" />
		<div className="flex flex-col flex-1 gap-2">
			<div className="flex justify-between gap-2">
				<div className="h-3 bg-muted rounded w-2/3" />
				<div className="h-3 bg-muted rounded w-12" />
			</div>
			<div className="h-3 bg-muted rounded w-full" />
			<div className="h-3 bg-muted rounded w-4/5" />
		</div>
	</div>
);

export function NavActions() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isOpen, setIsOpen] = React.useState(false);
	const {
		notifications,
		isLoading,
		error,
		fetchNotifications,
		markAsReadLocal,
		hasNewNotification,
		setHasNewNotification,
	} = useNotificationStore();

	// Jumlah unread — untuk badge di header popover
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const isRedDotVisible = hasNewNotification || unreadCount > 0;

	// Fetch awal saat komponen dimuat agar jumlah unread bisa ditampilkan
	React.useEffect(() => {
		fetchNotifications(true);
	}, [fetchNotifications]);

	// Handler saat Popover diklik
	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			setIsOpen(open);
			if (open) {
				// Selalu fetch saat dibuka agar status Read/Unread sinkron
				fetchNotifications(false);

				if (hasNewNotification) {
					setHasNewNotification(false);
				}
			}
		},
		[fetchNotifications, hasNewNotification, setHasNewNotification],
	);

	// Handler saat Notifikasi diklik
	const handleNotificationClick = async (notif: AppNotification) => {
		// 1. Optimistic update: Langsung ubah status isRead menjadi true secara lokal
		// Ini akan membuat unreadCount langsung berkurang dan menghilangkan red dot
		if (notif._id) markAsReadLocal(notif._id);

		// API mapping: handle typo 'reseurceId' or 'resourceId'
		const resourceId =
			(notif.data as any)?.reseurceId || (notif.data as any)?.resourceId;
		const resource = notif.data?.resource;
		const isClient = user?.role === "client";
		const isUnassigned = user?.role === "staff_unassigned";

		const resourceUrlMap: Record<string, string> = {
			work_order:
				resourceId ?
					`/dashboard/internal/workorders/detail/${resourceId}`
				:	"/dashboard/internal/workorders",
			invitation:
				isUnassigned ?
					`/dashboard/unassigned/invitations-history`
				:	"/dashboard/internal/staff/history-invitations",
			service_request:
				isClient ?
					resourceId ? `/dashboard/client/submissions/${resourceId}`
					:	"/dashboard/client/submissions"
				: resourceId ?
					`/dashboard/internal/business/services/request/detail/${resourceId}`
				:	"/dashboard/internal/business/services/request",
		};

		const url = resource ? resourceUrlMap[resource] : "/dashboard/internal";

		setIsOpen(false);
		if (url) navigate(url);
	};

	return (
		<div className="flex items-center gap-2 text-sm mr-1">
			<Popover open={isOpen} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<div className="flex items-center gap-2 border border-primary/30 rounded-full px-3 py-1.5 hover:cursor-pointer hover:bg-muted transition-all">
						<div className="relative flex items-center justify-center">
							<Bell size={16} className="text-primary" />
							{/* Ping — muncul saat ada notif baru (dari init API / via Realtime FCM) */}
							{isRedDotVisible && (
								<span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
									<span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white border border-background">
										{unreadCount > 0 ?
											unreadCount > 9 ?
												"9+"
											:	unreadCount
										:	"1"}
									</span>
								</span>
							)}
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
							{/* ── List ── */}
							<div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-1">
								{/* Loading skeleton */}
								{isLoading && (
									<>
										<NotificationSkeleton />
										<NotificationSkeleton />
										<NotificationSkeleton />
									</>
								)}

								{/* Error state */}
								{!isLoading && error && (
									<div className="flex flex-col items-center justify-center h-36 text-center px-4 gap-2">
										<AlertTriangle className="w-6 h-6 text-amber-500" />
										<p className="text-xs text-muted-foreground">{error}</p>
										<button
											onClick={() => fetchNotifications(false)}
											className="text-xs text-primary underline underline-offset-2 hover:opacity-70 transition-opacity">
											Coba lagi
										</button>
									</div>
								)}

								{/* Empty state */}
								{!isLoading && !error && notifications.length === 0 && (
									<div className="flex flex-col items-center justify-center h-36 text-center px-4">
										<Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
										<p className="text-sm font-medium text-foreground/70">
											Belum ada notifikasi
										</p>
										<p className="text-xs text-muted-foreground mt-1">
											Pesan baru akan muncul di sini.
										</p>
									</div>
								)}

								{/* Notification items */}
								{!isLoading &&
									!error &&
									notifications.map((notif) => {
										const type = resolveType(notif);
										return (
											<div
												key={notif._id}
												onClick={() => handleNotificationClick(notif)}
												className={`group relative flex items-start gap-3 p-3  rounded-lg hover:bg-muted/60 transition-colors cursor-pointer ${
													!notif.isRead ? "bg-primary/5" : "bg-transparent"
												}`}>
												{/* Unread dot */}
												{!notif.isRead && (
													<div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
												)}

												{/* Icon */}
												<div
													className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-0.5 ${getIconBg(type)}`}>
													{getNotificationIcon(type)}
												</div>

												{/* Content */}
												<div className="flex flex-col flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2 mb-1">
														<span
															className={`text-sm truncate ${!notif.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
															{notif.title}
														</span>
														<span className="text-[10px] whitespace-nowrap text-muted-foreground mt-0.5">
															{formatDistanceToNow(new Date(notif.createdAt), {
																addSuffix: true,
																locale: localeId,
															})}
														</span>
													</div>
													<p className="text-xs text-muted-foreground leading-relaxed ">
														{notif.body}
													</p>
												</div>
											</div>
										);
									})}
							</div>
						</SidebarContent>
					</Sidebar>
				</PopoverContent>
			</Popover>
		</div>
	);
}
