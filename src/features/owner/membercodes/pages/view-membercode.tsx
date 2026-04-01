import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/shared/atoms/header-content";
import {
	Plus,
	Ticket,
	CheckCircle2,
	Copy,
	Check,
	Hash,
	Users,
} from "lucide-react";
import { useMembercode } from "../hooks/useMembercode";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { notifySuccess } from "@/lib/toast-helper";

/* ─── Types ─────────────────────────────────────────────────────────── */
type CopiedMap = Record<string, boolean>;

/* ─── Sub-components ─────────────────────────────────────────────────── */

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

/* ─── Main Page ──────────────────────────────────────────────────────── */

const ViewMemberCodes = () => {
	const navigate = useNavigate();
	const { membercodes, loading, error, fetchMembercodes } = useMembercode();
	const [copied, setCopied] = useState<CopiedMap>({});

	useEffect(() => {
		void fetchMembercodes();
	}, [fetchMembercodes]);

	const handleCopy = (id: string, code: string) => {
		navigator.clipboard.writeText(code);
		notifySuccess("Kode berhasil disalin!");
		setCopied((prev) => ({ ...prev, [id]: true }));
		setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
	};

	const formatDate = (isoStr: string | null) => {
		if (!isoStr) return "-";
		return new Date(isoStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	/* Stats */
	const totalCodes = membercodes.length;
	const claimedCount = membercodes.filter((m) => m.isClaimed).length;
	const availableCount = totalCodes - claimedCount;

	/* Grouped by prefix */
	const groupedMembercodes = useMemo(
		() =>
			membercodes.reduce(
				(acc, current) => {
					const prefix =
						current.code.includes("-") ?
							current.code.split("-")[0]
						:	"Lain-lain";
					if (!acc[prefix]) acc[prefix] = [];
					acc[prefix].push(current);
					return acc;
				},
				{} as Record<string, typeof membercodes>,
			),
		[membercodes],
	);

	/* ── Error state ── */
	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	/* ── Stagger animation helpers ── */
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.06 },
		},
	};

	return (
		<div className="h-full flex flex-col">
			{/* ── Header ── */}
			<PageHeader
				title="Kode Berlangganan"
				subtitle="Kelola kode berlangganan untuk Klien"
				addLabel="Buat Kode Baru"
				backPath={true}
				addIcon={<Plus className="size-4" />}
				onAddClick={() => {
					navigate("/dashboard/internal/membercodes/create");
				}}
			/>

			<div className="pb-8 space-y-7">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}>
							<SectionLoading message="Memuat data kode berlangganan..." />
						</motion.div>
					: Object.keys(groupedMembercodes).length > 0 ?
						<motion.div
							key="content"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-7">
							{/* ── Stats bar ── */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<StatCard
									icon={<Hash className="w-5 h-5" />}
									label="Total Kode"
									value={totalCodes}
									color="blue"
								/>
								<StatCard
									icon={<Users className="w-5 h-5" />}
									label="Sudah Diklaim"
									value={claimedCount}
									color="emerald"
								/>
								<StatCard
									icon={<Ticket className="w-5 h-5" />}
									label="Tersedia"
									value={availableCount}
									color="violet"
								/>
							</div>

							{/* ── Grouped sections ── */}
							{Object.entries(groupedMembercodes).map(([prefix, codes]) => {
								const claimedInGroup = codes.filter((c) => c.isClaimed).length;

								return (
									<div key={prefix} className="space-y-3">
										{/* Batch heading */}
										<div className="flex items-center gap-3">
											<div className="flex items-center gap-2">
												<Ticket className="w-4 h-4 text-slate-400" />
												<h2 className="text-sm font-bold text-slate-600 tracking-wide uppercase">
													Batch {prefix}
												</h2>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant="secondary"
													className="bg-slate-100 text-slate-500 text-xs font-semibold rounded-full px-2.5">
													{codes.length} kode
												</Badge>
												{claimedInGroup > 0 && (
													<Badge
														variant="secondary"
														className="bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full px-2.5">
														{claimedInGroup} diklaim
													</Badge>
												)}
											</div>
											<div className="flex-1 h-px bg-slate-100" />
										</div>

										{/* Code list */}
										<motion.div
											variants={containerVariants}
											initial="hidden"
											animate="show"
											className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
											{codes.map((item) => {
												const isCopied = !!copied[item._id];
												return (
													<motion.div
														key={item._id}
														className="group flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors duration-150">
														{/* Status dot */}
														<div
															className={`shrink-0 w-2.5 h-2.5 rounded-full ${item.isClaimed ? "bg-emerald-400" : "bg-slate-300"}`}
														/>

														{/* Code */}
														<div className="flex-1 min-w-0 flex items-center gap-2">
															<span className="font-mono text-sm font-semibold text-slate-800 tracking-wider">
																{item.code}
															</span>
															<button
																onClick={() => handleCopy(item._id, item.code)}
																title="Salin kode"
																className={`opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md p-1 ${
																	isCopied ?
																		"text-emerald-500 bg-emerald-50"
																	:	"text-slate-400 hover:text-blue-600 hover:bg-blue-50"
																}`}>
																{isCopied ?
																	<Check className="size-3.5" />
																:	<Copy className="size-3.5" />}
															</button>
														</div>

														{/* Claimed by */}
														<div className="hidden md:flex flex-col items-end min-w-[160px] text-right">
															{item.isClaimed ?
																<>
																	<span className="text-xs font-semibold text-slate-700 line-clamp-1">
																		{item.claimedBy?.name ?? "—"}
																	</span>
																	<span className="text-[11px] text-slate-400 truncate max-w-[150px]">
																		{item.claimedBy?.email ?? "-"}
																	</span>
																</>
															:	<span className="text-xs text-slate-400 italic">
																	Belum diklaim
																</span>
															}
														</div>

														{/* Date */}
														<div className="hidden sm:block text-xs text-slate-400 font-medium whitespace-nowrap min-w-[90px] text-right">
															{formatDate(item.createdAt)}
														</div>

														{/* Status badge */}
														<div className="shrink-0">
															{item.isClaimed ?
																<Badge className="bg-emerald-50 text-emerald-600 border-0 gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
																	<CheckCircle2 className="size-3" />
																	Diklaim
																</Badge>
															:	<Badge className="bg-violet-50 text-violet-500 border-0 gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
																	<Ticket className="size-3" />
																	Tersedia
																</Badge>
															}
														</div>
													</motion.div>
												);
											})}
										</motion.div>
									</div>
								);
							})}
						</motion.div>
					:	<motion.div
							key="empty"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}>
							<EmptyData />
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ViewMemberCodes;
