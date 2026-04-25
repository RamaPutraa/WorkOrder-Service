import { useNotificationStore } from "@/store/notificationStore";
import { requestNotificationPermission, deleteNotificationToken } from "@/lib/fcm";
import { registerFcmTokenApi, unregisterFcmTokenApi } from "@/features/notifications/services/notification-service";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
	const { 
		isNotificationEnabled, 
		setIsNotificationEnabled, 
		fcmToken, 
		setFcmToken 
	} = useNotificationStore();
	
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleNotification = async (checked: boolean) => {
		setIsLoading(true);

		try {
			if (checked) {
				// User wants to enable notifications
				if (Notification.permission === "denied") {
					toast.error("Notifikasi diblokir oleh browser. Silakan izinkan lewat ikon gembok di sebelah URL (Address Bar).");
					setIsLoading(false);
					return;
				}

				const token = await requestNotificationPermission();
				
				if (token) {
					setIsNotificationEnabled(true);
					setFcmToken(token);
					await registerFcmTokenApi(token).catch(console.error);
					toast.success("Notifikasi berhasil diaktifkan");
				} else {
					toast.error("Gagal mendapatkan izin notifikasi");
				}
			} else {
				// User wants to disable notifications
				setIsNotificationEnabled(false);
				
				if (fcmToken) {
					// Unregister from backend
					await unregisterFcmTokenApi(fcmToken).catch(console.error);
					// Delete token locally and from Firebase
					await deleteNotificationToken();
					setFcmToken(null);
				}
				
				toast.info("Notifikasi telah dinonaktifkan");
			}
		} catch (error) {
			console.error("[Settings] Toggle notification failed", error);
			toast.error("Terjadi kesalahan saat mengubah pengaturan notifikasi");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container max-w-4xl py-8 space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
				<p className="text-muted-foreground">
					Kelola pengaturan preferensi akun Anda.
				</p>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BellRing className="w-5 h-5" />
							Notifikasi Push
						</CardTitle>
						<CardDescription>
							Terima pemberitahuan secara real-time meskipun Anda tidak sedang membuka aplikasi.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="notif-toggle" className="text-base font-medium">
									Izinkan Notifikasi Push
								</Label>
								<p className="text-sm text-muted-foreground">
									Dapatkan update untuk tugas, pembaruan status, dan pesan baru.
								</p>
							</div>
							<Switch
								id="notif-toggle"
								checked={isNotificationEnabled}
								onCheckedChange={handleToggleNotification}
								disabled={isLoading}
							/>
						</div>

						{Notification.permission === "denied" && (
							<div className="rounded-md bg-destructive/10 p-4 mt-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-destructive">
											Izin Browser Diperlukan
										</h3>
										<div className="mt-2 text-sm text-destructive/90">
											<p>
												Browser Anda saat ini memblokir notifikasi untuk situs ini. 
												Anda harus mengizinkannya secara manual melalui ikon gembok di address bar browser Anda.
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
