import { useEffect, useState } from "react";
import {
	QrCode,
	Copy,
	Check,
	Trash2,
	Infinity,
	CalendarClock,
	
} from "lucide-react";
import { useStaffInvitationCode } from "../hooks/use-staff-invitation-code";
import { useDialogStore } from "@/store/dialogStore";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { notifySuccess } from "@/lib/toast-helper";

type CopiedMap = Record<string, boolean>;

const ROLE_LABEL: Record<string, string> = {
	staff_company: "Pegawai Staff",
	manager_company: "Manager",
};

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.06 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 6 },
	show: { opacity: 1, y: 0 },
};

interface StaffInvitationCodeTabProps {
	onRefreshParent?: () => void;
	refreshKey?: number;
}

export const StaffInvitationCodeTab = ({
	onRefreshParent,
	refreshKey = 0,
}: StaffInvitationCodeTabProps) => {
	const {
		invitationCodes,
		loading,
		submitting,
		error,
		fetchInvitationCodes,
		revokeCode,
	} = useStaffInvitationCode();

	const [copied, setCopied] = useState<CopiedMap>({});
	const { showDialog } = useDialogStore();

	useEffect(() => {
		void fetchInvitationCodes();
	}, [fetchInvitationCodes, refreshKey]);

	const handleCopy = (id: string, code: string) => {
		navigator.clipboard.writeText(code);
		notifySuccess("Kode berhasil disalin!");
		setCopied((prev) => ({ ...prev, [id]: true }));
		setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
	};

	const handleRevoke = (item: StaffInvitationCode) => {
		showDialog({
			title: "Hapus Kode Undangan?",
			description: `Kode "${item.code}" akan dihapus secara permanen dan tidak dapat digunakan lagi. Tindakan ini tidak dapat dibatalkan.`,
			confirmText: "Ya, Hapus",
			cancelText: "Batal",
			onConfirm: async () => {
				await revokeCode(item._id);
				onRefreshParent?.();
			},
		});
	};

	if (error) return <EmptyData />;

	const totalCount = invitationCodes.length;

	return (
		<div className="space-y-6 pt-4">
			<AnimatePresence mode="wait">
				{loading ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<SectionLoading message="Memuat daftar kode undangan..." />
					</motion.div>
				) : invitationCodes.length > 0 ? (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-6"
					>
						{/* Stats */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{[
								{
									label: "Total Kode",
									value: totalCount,
									color: "blue" as const,
								},
								
							].map(({ label, value, color }) => (
								<div
									key={label}
									className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm"
								>
									<div>
										<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
											{label}
										</p>
										<p
											className={`text-xl font-bold leading-tight ${
												color === "blue" ? "text-blue-700" : "text-slate-500"
											}`}
										>
											{value}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Section label */}
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<QrCode className="w-4 h-4 text-slate-400" />
								<h2 className="text-sm font-bold text-slate-600 tracking-wide uppercase">
									Daftar Kode Undangan
								</h2>
							</div>
							<Badge
								variant="secondary"
								className="bg-slate-100 text-slate-500 text-xs font-semibold rounded-full px-2.5"
							>
								{totalCount} kode
							</Badge>
							<div className="flex-1 h-px bg-slate-100" />
						</div>

						{/* Code cards */}
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="show"
							className="space-y-3"
						>
							{invitationCodes.map((item) => {
								const isCopied = !!copied[item._id];
								const isClaimable = item.isClaimable;

								return (
									<motion.div
										key={item._id}
										variants={itemVariants}
										className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-150"
									>
										<div className="p-4">
											{/* Top row: code + status + copy */}
											<div className="flex items-center justify-between gap-3 flex-wrap">
												<div className="flex items-center gap-2.5 min-w-0">
													{/* status dot */}
													<span
														className={`shrink-0 w-2 h-2 rounded-full ${
															isClaimable
																? "bg-emerald-500 animate-pulse"
																: "bg-slate-300"
														}`}
													/>
													{/* code */}
													<span className="font-mono text-lg font-bold text-slate-800 tracking-widest truncate">
														{item.code}
													</span>
												</div>

												<div className="flex items-center gap-1.5 shrink-0">
													{/* Copy button */}
													<button
														onClick={() => handleCopy(item._id, item.code)}
														title="Salin kode"
														className={`transition-all duration-200 rounded-lg p-1.5 text-xs ${
															isCopied
																? "text-emerald-600 bg-emerald-50"
																: "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
														}`}
													>
														{isCopied ? (
															<Check className="w-3.5 h-3.5" />
														) : (
															<Copy className="w-3.5 h-3.5" />
														)}
													</button>

													{/* Revoke */}
													<button
														onClick={() => handleRevoke(item)}
														title="Hapus kode"
														disabled={submitting}
														className="transition-all duration-200 rounded-lg p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</button>
												</div>
											</div>

											{/* Badges row */}
											<div className="flex flex-wrap gap-1.5 mt-3">
												{/* Role */}
												<Badge
													variant="outline"
													className={`rounded-full text-[10px] ${
														item.role === "manager_company"
															? "border-violet-200 text-violet-700 bg-violet-50"
															: "border-indigo-200 text-indigo-700 bg-indigo-50"
													}`}
												>
													{ROLE_LABEL[item.role] ?? item.role}
												</Badge>

												{/* Position */}
												{item.position && (
													<Badge
														variant="outline"
														className="rounded-full text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50"
													>
														{item.position.name}
													</Badge>
												)}

												{/* Status */}
												<Badge
													variant="outline"
													className={`rounded-full text-[10px] ${
														isClaimable
															? "border-emerald-200 text-emerald-700 bg-emerald-50"
															: "border-slate-200 text-slate-500 bg-slate-50"
													}`}
												>
													{isClaimable ? "Aktif" : "Nonaktif/Habis"}
												</Badge>

												{/* Usage */}
												<Badge
													variant="outline"
													className="rounded-full text-[10px] border-slate-200 text-slate-600 flex items-center gap-1"
												>
													{item.usedCount} /{" "}
													{item.maxUses === null ? (
														<Infinity className="w-2.5 h-2.5" />
													) : (
														item.maxUses
													)}{" "}
													klaim
												</Badge>

												{/* Expiry */}
												{item.expiresAt ? (
													<Badge
														variant="outline"
														className="rounded-full text-[10px] border-amber-200 text-amber-700 bg-amber-50 flex items-center gap-1"
													>
														<CalendarClock className="w-2.5 h-2.5" />
														{new Date(item.expiresAt).toLocaleDateString(
															"id-ID",
															{
																day: "numeric",
																month: "short",
																year: "numeric",
															},
														)}
													</Badge>
												) : (
													<Badge
														variant="outline"
														className="rounded-full text-[10px] border-slate-200 text-slate-400"
													>
														Tidak kadaluarsa
													</Badge>
												)}
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					</motion.div>
				) : (
					<motion.div
						key="empty"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<EmptyData />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

