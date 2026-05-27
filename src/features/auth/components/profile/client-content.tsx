import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
	Building2,
	Link2,
	LinkIcon,
	LogOut,
	AtSign,
	CalendarDays,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	getAllPairedAccount,
	detachPairedAccount,
} from "@/features/client/pairing-account/services/pairing-account";

// ── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonRow() {
	return (
		<div className="flex items-center justify-between py-4 px-5 rounded-xl border border-slate-100 bg-white animate-pulse">
			<div className="flex items-center gap-4">
				<div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
				<div className="space-y-2">
					<div className="h-3.5 w-36 rounded bg-slate-100" />
					<div className="h-3 w-52 rounded bg-slate-100" />
				</div>
			</div>
			<div className="h-8 w-24 rounded-lg bg-slate-100" />
		</div>
	);
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
			<div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
				<LinkIcon className="w-6 h-6 text-slate-300" />
			</div>
			<div>
				<p className="text-sm font-medium text-slate-700">Belum ada integrasi aktif</p>
				<p className="text-sm text-slate-400 mt-1 max-w-xs">
					Kunjungi halaman layanan perusahaan dan klik{" "}
					<span className="font-medium text-slate-500">"Mulai Hubungkan Akun"</span>{" "}
					untuk memulai.
				</p>
			</div>
		</div>
	);
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ClientContent() {
	const [accounts, setAccounts] = useState<ExternalAccount[]>([]);
	const [loading, setLoading] = useState(true);
	const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
	const [confirmId, setConfirmId] = useState<string | null>(null);

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				const res = await getAllPairedAccount();
				if (res.data) setAccounts(res.data);
			} catch (err) {
				console.error("Failed to fetch paired accounts", err);
			} finally {
				setLoading(false);
			}
		};
		fetchAccounts();
	}, []);

	const handleDisconnect = async (id: string) => {
		setDisconnectingId(id);
		setConfirmId(null);
		try {
			await detachPairedAccount(id);
			setAccounts((prev) => prev.filter((a) => a._id !== id));
		} catch (err) {
			console.error("Failed to detach account", err);
		} finally {
			setDisconnectingId(null);
		}
	};

	return (
		<div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
			{/* ── Header ────────────────────────────────────────────────── */}
			<div className="flex items-start gap-3 px-6 pt-6 pb-5">
				<div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
					<Link2 className="w-4 h-4 text-primary" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<h2 className="text-base font-semibold text-slate-800">Integrasi Akun</h2>
						{!loading && accounts.length > 0 && (
							<span className="text-xs text-slate-400">
								<span className="font-semibold text-slate-600">{accounts.length}</span> aktif
							</span>
						)}
					</div>
					<p className="text-sm text-slate-400 mt-0.5 leading-relaxed">
						Kelola koneksi akun Anda dengan sistem perusahaan untuk akses layanan eksklusif.
					</p>
				</div>
			</div>

			{/* ── Divider ───────────────────────────────────────────────── */}
			<div className="border-t border-slate-100" />

			{/* ── Body ──────────────────────────────────────────────────── */}
			<div className="p-4">
				{loading ? (
					<div className="space-y-2">
						<SkeletonRow />
						<SkeletonRow />
					</div>
				) : accounts.length === 0 ? (
					<EmptyState />
				) : (
					<div className="space-y-2">
						{accounts.map((account) => {
							const isConfirming = confirmId === account._id;
							const isDisconnecting = disconnectingId === account._id;

							return (
								<div
									key={account._id}
									className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 px-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
								>
									{/* Left — Identity */}
									<div className="flex items-center gap-4 min-w-0">
										<div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
											<Building2 className="w-4 h-4 text-slate-400" />
										</div>

										<div className="min-w-0">
											<div className="flex items-center gap-2">
												<p className="text-sm font-semibold text-slate-800 truncate">
													{account.company.name}
												</p>
												<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-600 shrink-0">
													<span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
													Aktif
												</span>
											</div>

											<div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
												<div className="flex items-center gap-1 text-xs text-slate-400">
													<AtSign className="w-3 h-3 shrink-0" />
													<span className="truncate max-w-[180px]">
														{account.externalCustomerEmail || "-"}
													</span>
												</div>
												<div className="flex items-center gap-1 text-xs text-slate-400">
													<CalendarDays className="w-3 h-3 shrink-0" />
													<span>
														{account.pairedAt
															? format(new Date(account.pairedAt), "dd MMM yyyy", { locale: localeId })
															: "-"}
													</span>
												</div>
											</div>
										</div>
									</div>

									{/* Right — Action */}
									{account.integrationType === "external_system" && (
										<div className="flex items-center gap-2 shrink-0">
											{isConfirming ? (
												<>
													<span className="text-xs text-slate-500 mr-1">Putuskan koneksi?</span>
													<Button
														size="sm"
														variant="destructive"
														className="h-7 text-xs px-3"
														onClick={() => handleDisconnect(account._id)}
														disabled={isDisconnecting}
													>
														{isDisconnecting ? (
															<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
														) : (
															"Ya, Putuskan"
														)}
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="h-7 text-xs px-3 text-slate-500"
														onClick={() => setConfirmId(null)}
													>
														Batal
													</Button>
												</>
											) : (
												<Button
													size="sm"
													variant="ghost"
													className="h-7 text-xs gap-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
													onClick={() => setConfirmId(account._id)}
												>
													<LogOut className="w-3.5 h-3.5" />
													Putuskan
													<ChevronRight className="w-3 h-3 opacity-50" />
												</Button>
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
