import { BellRing, CheckCircle2, ShieldAlert, Info } from "lucide-react";
import PageHeader from "@/shared/atoms/header-content";

export default function SettingsPage() {
	const permission = Notification.permission;

	const permissionConfig = {
		granted: {
			icon: CheckCircle2,
			label: "Aktif & Diizinkan",
			description:
				"Notifikasi push telah diizinkan. Anda akan menerima pemberitahuan secara real-time.",
			iconClass: "text-emerald-500",
			bgClass: "bg-emerald-50 border-emerald-100",
			badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
		},
		denied: {
			icon: ShieldAlert,
			label: "Diblokir oleh Browser",
			description:
				"Notifikasi diblokir. Klik ikon gembok (🔒) di sebelah URL, lalu ubah izin notifikasi ke 'Izinkan' secara manual.",
			iconClass: "text-rose-500",
			bgClass: "bg-rose-50 border-rose-100",
			badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
		},
		default: {
			icon: Info,
			label: "Belum Ditentukan",
			description:
				"Izin notifikasi belum diberikan. Klik di mana saja pada halaman ini untuk memunculkan permintaan izin dari browser.",
			iconClass: "text-amber-500",
			bgClass: "bg-amber-50 border-amber-100",
			badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
		},
	};

	const config = permissionConfig[permission];
	const Icon = config.icon;

	return (
		<div className="space-y-6 pb-8">
			<PageHeader
				title="Pengaturan"
				subtitle="Kelola preferensi dan konfigurasi akun Anda."
			/>

			<div className="max-w-2xl space-y-4">
				{/* Section Label */}
				<p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-1">
					Notifikasi
				</p>

				{/* Notification Card */}
				<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
					{/* Card Header */}
					<div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-muted/20">
						<div className="p-2 rounded-xl bg-blue-50">
							<BellRing className="w-4 h-4 text-blue-500" />
						</div>
						<div>
							<h2 className="text-sm font-semibold text-slate-800">
								Notifikasi Push
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								Pemberitahuan real-time dari sistem
							</p>
						</div>
					</div>

					{/* Status Row */}
					<div
						className={`flex items-start gap-4 px-5 py-5 border ${config.bgClass} m-4 rounded-xl`}>
						<Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconClass}`} />
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<p className="text-sm font-semibold text-slate-800">
									{config.label}
								</p>
								<span
									className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
									{permission}
								</span>
							</div>
							<p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
								{config.description}
							</p>
						</div>
					</div>

					{/* Footer Note */}
					<div className="px-5 py-3 border-t border-slate-100 bg-muted/10">
						<p className="text-xs text-slate-400 leading-relaxed">
							Izin notifikasi dikelola langsung oleh browser Anda. Untuk
							mengubah, silahkan ke pengaturan browser Anda.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
