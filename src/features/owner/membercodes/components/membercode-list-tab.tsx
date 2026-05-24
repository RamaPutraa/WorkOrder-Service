import React, { useEffect, useState } from "react";
import { Ticket, Copy, Check, Users, Trash2 } from "lucide-react";
import { useMembercode } from "../hooks/useMembercode";
import { useDialogStore } from "@/store/dialogStore";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { notifySuccess } from "@/lib/toast-helper";

type CopiedMap = Record<string, boolean>;

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	color: "blue" | "emerald" | "violet";
}

const colorMap = {
	blue: {
		bg: "bg-blue-50",
		icon: "text-blue-600",
		ring: "ring-blue-100",
		value: "text-blue-700",
	},
	emerald: {
		bg: "bg-emerald-50",
		icon: "text-emerald-600",
		ring: "ring-emerald-100",
		value: "text-emerald-700",
	},
	violet: {
		bg: "bg-violet-50",
		icon: "text-violet-600",
		ring: "ring-violet-100",
		value: "text-violet-700",
	},
};

const StatCard = ({ icon, label, value, color }: StatCardProps) => {
	const c = colorMap[color];
	return (
		<div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
			<div
				className={`shrink-0 w-11 h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center ${c.icon}`}>
				{icon}
			</div>
			<div>
				<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
					{label}
				</p>
				<p className={`text-2xl font-bold ${c.value} leading-tight`}>{value}</p>
			</div>
		</div>
	);
};

export const MembercodeListTab = () => {
	const { membercodes, loading, error, fetchMembercodes, removeMembercode } =
		useMembercode();
	const [copied, setCopied] = useState<CopiedMap>({});
	const { showDialog } = useDialogStore();

	useEffect(() => {
		void fetchMembercodes();
	}, [fetchMembercodes]);

	const handleCopy = (id: string, code: string) => {
		navigator.clipboard.writeText(code);
		notifySuccess("Voucer berhasil disalin!");
		setCopied((prev) => ({ ...prev, [id]: true }));
		setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
	};

	if (error) return <EmptyData />;

	const totalCodes = membercodes.length;

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.06 },
		},
	};

	return (
		<div className="space-y-7 pt-4">
			<AnimatePresence mode="wait">
				{loading ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}>
						<SectionLoading message="Memuat data pelanggan..." />
					</motion.div>
				) : membercodes.length > 0 ? (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-7">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<StatCard
								icon={<Users className="w-5 h-5" />}
								label="Total Pelanggan"
								value={totalCodes}
								color="blue"
							/>
							<StatCard
								icon={<Ticket className="w-5 h-5" />}
								label="Total Voucer"
								value={totalCodes}
								color="emerald"
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-slate-400" />
									<h2 className="text-sm font-bold text-slate-600 tracking-wide uppercase">
										Daftar Kode Pelanggan
									</h2>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-500 text-xs font-semibold rounded-full px-2.5">
										{totalCodes} pelanggan
									</Badge>
								</div>
								<div className="flex-1 h-px bg-slate-100" />
							</div>

							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="show"
								className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
								{membercodes.map((item) => {
									const isCopied = !!copied[item._id];
									return (
										<motion.div
											key={item._id}
											className="group flex flex-col px-4 py-3 hover:bg-slate-50/70 transition-colors duration-150">
											<div className="flex items-center gap-3">
												<div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
													<Users className="w-4 h-4" />
												</div>

												<div className="flex-1 min-w-0 flex flex-col justify-center">
													<span className="font-semibold text-sm text-slate-800 truncate">
														{item.externalCustomerEmail}
													</span>
													<span className="text-xs text-slate-500 truncate">
														{item.externalCustomerName}
													</span>
												</div>

												<div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
													<Ticket className="w-3.5 h-3.5 text-slate-400" />
													<span className="font-mono text-sm font-semibold text-slate-700 tracking-wider truncate max-w-[200px]">
														{item.token}
													</span>
													<button
														onClick={() => handleCopy(item._id, item.token)}
														title="Salin voucer"
														className={`shrink-0 transition-all duration-200 rounded-md p-1 ${isCopied
																? "text-emerald-500 bg-emerald-100"
																: "text-slate-400 hover:text-blue-600 hover:bg-blue-100"
															}`}>
														{isCopied ? (
															<Check className="size-3.5" />
														) : (
															<Copy className="size-3.5" />
														)}
													</button>
												</div>

												<div className="shrink-0 border-l border-muted-foreground/20 pl-2.5">
													<button
														onClick={() =>
															showDialog({
																title: "Hapus Data Pelanggan",
																description: `Apakah Anda yakin ingin menghapus voucer milik "${item.externalCustomerName}"?`,
																confirmText: "Hapus",
																cancelText: "Batal",
																onConfirm: async () => {
																	await removeMembercode(item._id);
																},
															})
														}
														title="Hapus voucer"
														className="transition-all duration-200 rounded-md p-1 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100">
														<Trash2 className="size-3.5" />
													</button>
												</div>
											</div>

											<div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-slate-100">
												<div className="flex items-center gap-2">
													<Ticket className="w-3 h-3 text-slate-400" />
													<span className="font-mono text-xs font-semibold text-slate-600 truncate max-w-[200px]">
														{item.token}
													</span>
												</div>
												<button
													onClick={() => handleCopy(item._id, item.token)}
													title="Salin voucer"
													className={`shrink-0 transition-all duration-200 rounded-md p-1 ${isCopied
															? "text-emerald-500 bg-emerald-50"
															: "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
														}`}>
													{isCopied ? (
														<Check className="size-3" />
													) : (
														<Copy className="size-3" />
													)}
												</button>
											</div>
										</motion.div>
									);
								})}
							</motion.div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="empty"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}>
						<EmptyData />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
