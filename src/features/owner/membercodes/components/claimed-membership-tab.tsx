import { useEffect, useState } from "react";
import { Users, Link2, Mail, Calendar, Search } from "lucide-react";
import { useMembership } from "../../pairing-company/hooks/useMembership";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export const ClaimedMembershipTab = () => {
	const { memberships, loading, error, fetchMemberships } = useMembership();
	const [search, setSearch] = useState("");

	useEffect(() => {
		void fetchMemberships();
	}, [fetchMemberships]);

	const formatDate = (dateStr: string | Date | undefined) => {
		if (!dateStr) return "–";
		return new Date(dateStr).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const filtered = memberships.filter((m) => {
		if (m.integrationType !== "claim_token") return false;

		const q = search.toLowerCase();
		return (
			m.user?.name?.toLowerCase().includes(q) ||
			m.user?.email?.toLowerCase().includes(q) ||
			m.externalAccount?.externalCustomerName?.toLowerCase().includes(q) ||
			m.externalAccount?.externalCustomerEmail?.toLowerCase().includes(q)
		);
	});

	if (error) return <EmptyData />;

	const containerVariants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.05 } },
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className="space-y-6 pt-4">
			<AnimatePresence mode="wait">
				{loading ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<SectionLoading message="Memuat data klaim token..." />
					</motion.div>
				) : (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-5">

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
								<div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center text-blue-600">
									<Users className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
										Total Voucer Diklaim
									</p>
									<p className="text-2xl font-bold text-blue-700 leading-tight">
										{filtered.length}
									</p>
								</div>
							</div>

						</div>

						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Cari berdasarkan nama atau email..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 rounded-xl"
							/>
						</div>

						{filtered.length === 0 ? (
							<EmptyData />
						) : (
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Link2 className="w-4 h-4 text-slate-400" />
										<h2 className="text-sm font-bold text-slate-600 tracking-wide uppercase">
											Daftar Akun Terklaim
										</h2>
									</div>
									<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-500 text-xs font-semibold rounded-full px-2.5">
										{filtered.length} akun
									</Badge>
									<div className="flex-1 h-px bg-slate-100" />
								</div>

								<motion.div
									variants={containerVariants}
									initial="hidden"
									animate="show"
									className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
									{filtered.map((item) => (
										<motion.div
											key={item.externalAccount?._id ?? item.user?._id}
											variants={itemVariants}
											className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4 hover:bg-slate-50/70 transition-colors duration-150">

											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
													{item.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
												</div>
												<div className="min-w-0">
													<p className="font-semibold text-sm text-slate-800 truncate">
														{item.user?.name ?? "–"}
													</p>
													<p className="text-xs text-slate-500 truncate flex items-center gap-1">
														<Mail className="w-3 h-3 shrink-0" />
														{item.user?.email ?? "–"}
													</p>
												</div>
											</div>

											<div className="hidden sm:flex items-center shrink-0">
												<div className="flex items-center gap-1 text-slate-300">
													<div className="w-8 h-px bg-slate-200" />
													<Link2 className="w-4 h-4 text-primary/50" />
													<div className="w-8 h-px bg-slate-200" />
												</div>
											</div>

											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div className="shrink-0 w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
													{item.externalAccount?.externalCustomerName
														?.charAt(0)
														?.toUpperCase() ?? "E"}
												</div>
												<div className="min-w-0">
													<p className="font-semibold text-sm text-slate-800 truncate">
														{item.externalAccount?.externalCustomerName ?? "–"}
													</p>
													<p className="text-xs text-slate-500 truncate flex items-center gap-1">
														<Mail className="w-3 h-3 shrink-0" />
														{item.externalAccount?.externalCustomerEmail ?? "–"}
													</p>
												</div>
											</div>

											<div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 sm:min-w-[90px] sm:justify-end">
												<Calendar className="w-3.5 h-3.5" />
												<span>{formatDate(item.externalAccount?.pairedAt?.toString())}</span>
											</div>

											<div className="shrink-0">
												<Badge className="bg-emerald-50 text-emerald-600 border-0 text-[11px] font-semibold px-2 py-0.5 rounded-full">
													Terklaim
												</Badge>
											</div>
										</motion.div>
									))}
								</motion.div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
