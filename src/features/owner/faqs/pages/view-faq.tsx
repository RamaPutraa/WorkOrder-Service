import { useEffect, useState } from "react";
import PageHeader from "@/shared/atoms/header-content";
import {
	FolderKanban,
	Plus,
	FileText,
	Hash,
	File,
	MessageCircleIcon,
	Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFaq } from "../hooks/useFaq";
import { useCompanyProfile } from "../../company/hooks/companyHooks";
import { AddFaqDialog } from "../components/faq-add-dialogs";
import { FaqItemCard } from "../components/faq-item-card";
import { ButtonLoading, SectionLoading } from "@/shared/atoms/loading-state";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useDialogStore } from "@/store/dialogStore";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyData } from "@/shared/molecules/empty-data";


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
					className={`flex items-center gap-2 px-4 h-8 rounded-full text-xs font-semibold transition-all duration-150 hover:cursor-pointer ${active === tab.key ?
						"bg-primary text-white shadow-sm"
						: "bg-slate-100 text-slate-500 hover:bg-slate-200"
						}`}>
					{tab.label}
					<Badge
						className={`text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] border-0 rounded-full font-bold ${active === tab.key ?
							"bg-white/20 text-white"
							: "bg-slate-200 text-slate-500"
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
		isActive: isFaqActive,
		loading,
		submitting,
		error,
		fetchFaqList,
		handleAddText,
		handleAddPdf,
		handleDelete,
		handleToggleActive,
		setIsActive,
	} = useFaq();

	const { company } = useCompanyProfile();

	const { showDialog } = useDialogStore();
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [selectedTextItem, setSelectedTextItem] = useState<FaqItem | null>(null);
	const [filter, setFilter] = useState<FilterType>("all");

	useEffect(() => {
		void fetchFaqList();
	}, [fetchFaqList]);

	// Sync FAQ active status dari company profile
	useEffect(() => {
		if (company && typeof (company as any).isFaqActive === "boolean") {
			setIsActive((company as any).isFaqActive);
		}
	}, [company, setIsActive]);

	const textItems = faqItems.filter((i) => i.type === "TEXT");
	const pdfItems = faqItems.filter((i) => i.type === "PDF");
	const filteredItems =
		filter === "all" ? faqItems : faqItems.filter((i) => i.type === filter);

	if (error) {
		return (
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
					Aktifkan fitur FAQ agar konten dapat dilihat oleh publik di halaman utama.
				</p>

				{/* ── Tombol Aktivasi Langsung ───────────────────── */}
				<Button
					onClick={() => {
						showDialog({
							title: "Aktifkan FAQ Publik?",
							description: "FAQ akan ditampilkan di halaman publik dan dapat dibaca oleh semua orang.",
							confirmText: "Ya, Aktifkan",
							cancelText: "Batal",
							onConfirm: async () => {
								await handleToggleActive(true);
								void fetchFaqList();
							},
						});
					}}
					disabled={submitting}
					className="rounded-xl shadow-sm px-6 h-11 text-sm font-semibold transition-transform active:scale-95 hover:cursor-pointer">
					<Power className="w-4 h-4 mr-2" />
					{submitting ? "Mengaktifkan..." : "Aktifkan FAQ Sekarang"}
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
						{/* Toggle FAQ Aktif/Nonaktif */}
						{loading ?
							<div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card">
								<ButtonLoading />
							</div>
							: <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card">
								<span className={`text-xs font-semibold ${isFaqActive ? "text-emerald-600" : "text-muted-foreground"}`}>
									{isFaqActive ? "FAQ Aktif" : "FAQ Nonaktif"}
								</span>
								<Switch
									checked={isFaqActive}
									disabled={submitting}
									onCheckedChange={() => {
										showDialog({
											title: isFaqActive ? "Nonaktifkan FAQ Publik?" : "Aktifkan FAQ Publik?",
											description: isFaqActive
												? "FAQ akan disembunyikan dari halaman publik dan tidak dapat diakses oleh umum."
												: "FAQ akan ditampilkan di halaman publik dan dapat dibaca oleh semua orang.",
											confirmText: isFaqActive ? "Ya, Nonaktifkan" : "Ya, Aktifkan",
											cancelText: "Batal",
											onConfirm: async () => {
												await handleToggleActive(!isFaqActive);
											},
										});
									}}
									className="data-[state=checked]:bg-emerald-600"
								/>
							</div>
						}

						{/* Satu tombol tambah */}
						<Button
							id="btn-add-faq"
							onClick={() => setShowAddDialog(true)}
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
						: <motion.div
							key="content"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-6">
							{/* ── Stats ── */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
								{[
									{
										label: "Total FAQ",
										value: faqItems.length,
										icon: Hash,
										color: "text-primary",
										bg: "bg-primary/8",
									},
									{
										label: "Konten Teks",
										value: textItems.length,
										icon: FileText,
										color: "text-blue-600",
										bg: "bg-blue-50",
									},
									{
										label: "Dokumen PDF",
										value: pdfItems.length,
										icon: File,
										color: "text-rose-500",
										bg: "bg-rose-50",
									},
								].map(({ label, value, icon: Icon, color, bg }) => (
									<div
										key={label}
										className="flex items-center gap-3 p-4 rounded-2xl border bg-white shadow-sm">
										<div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
											<Icon className={`w-4.5 h-4.5 ${color}`} />
										</div>
										<div className="min-w-0">
											<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
												{label}
											</p>
											<p className="text-sm font-bold text-slate-900 truncate mt-0.5">{value}</p>
										</div>
									</div>
								))}
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
														onViewText={(selected) => setSelectedTextItem(selected)}
														index={idx}
													/>
												))}
											</motion.div>
											: <motion.div
												key="empty-filter"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.3 }}>
												<EmptyData
													title={
														<span>Tidak ada item {filter === "TEXT" ? "teks" : "PDF"}{" "}
															ditemukan</span>
													}
													subtitle="Coba ubah filter atau tambah item baru."
													icon={FolderKanban}
												/>
											</motion.div>
										}
									</AnimatePresence>
								</div>
								:	/* ── Empty State ── */
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<EmptyData
										title={
											<span>Belum ada item FAQ</span>
										}
										subtitle="Mulai dengan menambahkan konten teks atau dokumen PDF."
										icon={FolderKanban}
									/>
								</motion.div>
							}
						</motion.div>
					}
				</AnimatePresence>
			</div>

			{/* ── Unified Dialog ── */}
			<AddFaqDialog
				open={showAddDialog}
				onClose={() => setShowAddDialog(false)}
				onSubmitText={handleAddText}
				onSubmitPdf={handleAddPdf}
				submitting={submitting}
			/>

			{/* ── Text Drawer ── */}
			<Sheet
				open={selectedTextItem !== null}
				onOpenChange={(open) => !open && setSelectedTextItem(null)}>
				<SheetContent className="w-full sm:max-w-md bg-white border-l border-slate-100 shadow-2xl p-0 flex flex-col">
					<SheetHeader className="p-6 border-b border-slate-100 shrink-0 text-left">
						<SheetTitle className="text-xl font-bold leading-tight">
							{selectedTextItem?.title}
						</SheetTitle>
						<SheetDescription className="text-sm text-slate-500">
							Detail Konten Teks FAQ
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="flex-1 p-6">
						<div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
							{selectedTextItem?.content}
						</div>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default ViewFaq;
