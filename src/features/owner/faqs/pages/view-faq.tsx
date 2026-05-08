import React, { useEffect, useState } from "react";
import PageHeader from "@/shared/atoms/header-content";
import {
	FolderKanban,
	Plus,
	FileText,
	Hash,
	File,
	MessageCircleIcon,
	Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFaq } from "../hooks/useFaq";
import { AddFaqDialog } from "../components/faq-add-dialogs";
import { FaqItemCard } from "../components/faq-item-card";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

/* ─── Stat Card ──────────────────────────────────────────────────────────── */

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	color: "blue" | "rose" | "slate";
}

const colorMap: Record<
	StatCardProps["color"],
	{ bg: string; icon: string; ring: string; value: string }
> = {
	blue: {
		bg: "bg-blue-50",
		icon: "text-blue-600",
		ring: "ring-blue-100",
		value: "text-blue-700",
	},
	rose: {
		bg: "bg-rose-50",
		icon: "text-rose-500",
		ring: "ring-rose-100",
		value: "text-rose-600",
	},
	slate: {
		bg: "bg-slate-50",
		icon: "text-slate-500",
		ring: "ring-slate-100",
		value: "text-slate-600",
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

/* ─── Filter Tabs ────────────────────────────────────────────────────────── */

type FilterType = "all" | "TEXT" | "PDF";

interface FilterTabsProps {
	active: FilterType;
	onChange: (val: FilterType) => void;
	counts: { all: number; text: number; pdf: number };
}

const FilterTabs = ({ active, onChange, counts }: FilterTabsProps) => {
	const tabs: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "Semua", count: counts.all },
		{ key: "TEXT", label: "Teks", count: counts.text },
		{ key: "PDF", label: "PDF", count: counts.pdf },
	];

	return (
		<div className="flex items-center gap-2 flex-wrap">
			{tabs.map((tab) => (
				<button
					key={tab.key}
					id={`faq-filter-${tab.key}`}
					onClick={() => onChange(tab.key)}
					className={`flex items-center gap-2 px-4 h-8 rounded-full text-xs font-semibold transition-all duration-150 hover:cursor-pointer ${
						active === tab.key ?
							"bg-primary text-white shadow-sm"
						:	"bg-slate-100 text-slate-500 hover:bg-slate-200"
					}`}>
					{tab.label}
					<Badge
						className={`text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] border-0 rounded-full font-bold ${
							active === tab.key ?
								"bg-white/20 text-white"
							:	"bg-slate-200 text-slate-500"
						}`}>
						{tab.count}
					</Badge>
				</button>
			))}
		</div>
	);
};

/* ─── Main Page ──────────────────────────────────────────────────────────── */

const ViewFaq = () => {
	const {
		faqItems,
		loading,
		submitting,
		error,
		fetchFaqList,
		handleAddText,
		handleAddPdf,
		handleDelete,
	} = useFaq();

	const [showDialog, setShowDialog] = useState(false);
	const [filter, setFilter] = useState<FilterType>("all");
	const navigate = useNavigate();

	useEffect(() => {
		void fetchFaqList();
	}, [fetchFaqList]);

	const textItems = faqItems.filter((i) => i.type === "TEXT");
	const pdfItems = faqItems.filter((i) => i.type === "PDF");
	const filteredItems =
		filter === "all" ? faqItems : faqItems.filter((i) => i.type === filter);

	if (error) {
		return (
			// min-h-[75vh] memastikan konten berada di tengah layar secara vertikal
			<div className="w-full min-h-[75vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
				{/* ── Ikon Dekoratif ───────────────────────────────────────── */}
				<div className="relative mb-8">
					{/* Efek cahaya berpendar (Glow) di belakang ikon */}
					<div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />

					{/* Kotak Ikon Squircle */}
					<div className="relative w-18 h-18 bg-primary/5 border border-border shadow-sm rounded-xl flex items-center justify-center transform transition-transform hover:scale-105  duration-300">
						<MessageCircleIcon
							className="w-8 h-8 text-primary"
							strokeWidth={1.5}
						/>
					</div>
				</div>

				{/* ── Teks Arahan ──────────────────────────────────────────── */}
				<h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3 text-center">
					Fitur FAQ Belum Aktif
				</h2>
				<p className="text-sm sm:text-base text-muted-foreground max-w-md text-center leading-relaxed mb-8">
					{error}
				</p>

				{/* ── Tombol Aksi (Untuk Navigasi Nanti) ───────────────────── */}
				<Button
					onClick={() => {
						navigate("/dashboard/internal/company");
					}}
					className="rounded-xl shadow-sm px-6 h-11 text-sm font-semibold transition-transform active:scale-95 hover:cursor-pointer">
					<Settings className="w-4 h-4 mr-2" />
					Buka Profil Perusahaan
				</Button>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			{/* ── Page Header ── */}
			<PageHeader
				title="Kelola FAQ"
				subtitle="Kelola pertanyaan umum dan dokumen referensi untuk publik"
				backPath={true}
				actionButtons={
					<div className="flex items-center gap-3 w-full md:w-auto">
						{/* Satu tombol tambah */}
						<Button
							id="btn-add-faq"
							onClick={() => setShowDialog(true)}
							className="flex-1 md:flex-none h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-sm hover:cursor-pointer transition-all active:scale-95 flex items-center gap-2">
							<Plus className="w-4 h-4" />
							<span>Tambah FAQ</span>
						</Button>
					</div>
				}
			/>

			<div className="pb-10 space-y-6">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}>
							<SectionLoading message="Memuat data FAQ..." />
						</motion.div>
					:	<motion.div
							key="content"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-6">
							{/* ── Stats ── */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<StatCard
									icon={<Hash className="w-5 h-5" />}
									label="Total FAQ"
									value={faqItems.length}
									color="slate"
								/>
								<StatCard
									icon={<FileText className="w-5 h-5" />}
									label="Konten Teks"
									value={textItems.length}
									color="blue"
								/>
								<StatCard
									icon={<File className="w-5 h-5" />}
									label="Dokumen PDF"
									value={pdfItems.length}
									color="rose"
								/>
							</div>

							{/* ── Filter + List ── */}
							{faqItems.length > 0 ?
								<div className="space-y-4">
									<div className="flex items-center justify-between gap-3 flex-wrap">
										<FilterTabs
											active={filter}
											onChange={setFilter}
											counts={{
												all: faqItems.length,
												text: textItems.length,
												pdf: pdfItems.length,
											}}
										/>
										<p className="text-xs text-slate-400 font-medium">
											{filteredItems.length} item ditampilkan
										</p>
									</div>

									<AnimatePresence mode="wait">
										{filteredItems.length > 0 ?
											<motion.div
												key={`grid-${filter}`}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{filteredItems.map((item, idx) => (
													<FaqItemCard
														key={item.id}
														item={item}
														onDelete={handleDelete}
														index={idx}
													/>
												))}
											</motion.div>
										:	<motion.div
												key="empty-filter"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="flex flex-col items-center py-16 text-center">
												<div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
													<FolderKanban className="w-7 h-7 text-slate-400" />
												</div>
												<p className="text-sm font-semibold text-slate-600">
													Tidak ada item {filter === "TEXT" ? "teks" : "PDF"}{" "}
													ditemukan
												</p>
												<p className="text-xs text-slate-400 mt-1">
													Coba ubah filter atau tambah item baru.
												</p>
											</motion.div>
										}
									</AnimatePresence>
								</div>
							:	/* ── Empty State ── */
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<div className="flex flex-col items-center py-20 text-center gap-4">
										<div className="w-16 h-16 rounded-2xl shadow-sm bg-primary/5 border border-border flex items-center justify-center">
											<FolderKanban className="w-8 h-8 text-primary" />
										</div>
										<div>
											<p className="text-base font-bold text-slate-700">
												Belum ada item FAQ
											</p>
											<p className="text-sm text-slate-400 mt-1">
												Mulai dengan menambahkan konten teks atau dokumen PDF.
											</p>
										</div>
									</div>
								</motion.div>
							}
						</motion.div>
					}
				</AnimatePresence>
			</div>

			{/* ── Unified Dialog ── */}
			<AddFaqDialog
				open={showDialog}
				onClose={() => setShowDialog(false)}
				onSubmitText={handleAddText}
				onSubmitPdf={handleAddPdf}
				submitting={submitting}
			/>
		</div>
	);
};

export default ViewFaq;
