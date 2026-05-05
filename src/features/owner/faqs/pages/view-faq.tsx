import React, { useEffect, useState } from "react";
import PageHeader from "@/shared/atoms/header-content";
import { FolderKanban, Plus, FileText, Hash, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFaq } from "../hooks/useFaq";
import { AddFaqDialog } from "../components/faq-add-dialogs";
import { FaqItemCard } from "../components/faq-item-card";
import { SectionLoading } from "@/shared/atoms/loading-state";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useDialogStore } from "@/store/dialogStore";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const MOCK_FAQ_ITEMS: FaqItem[] = [
	{
		id: 1,
		title: "Bagaimana cara mendaftar sebagai klien?",
		content:
			"Untuk mendaftar sebagai klien, Anda perlu mengunjungi halaman registrasi dan mengisi formulir pendaftaran dengan data diri yang valid. Setelah itu, Anda akan menerima email verifikasi untuk mengaktifkan akun Anda.",
		type: "TEXT",
		file_url: null,
		nime_type: null,
		size: null,
		created_at: "2026-05-01T08:00:00Z",
	},
	{
		id: 2,
		title: "Panduan Penggunaan Layanan Work Order",
		content: "",
		type: "PDF",
		file_url: "https://example.com/panduan-workorder.pdf",
		nime_type: "application/pdf",
		size: 2048576,
		created_at: "2026-05-02T10:30:00Z",
	},
	{
		id: 3,
		title: "Apa saja layanan yang tersedia?",
		content:
			"Kami menyediakan berbagai layanan seperti pemeliharaan fasilitas, perbaikan peralatan, dan layanan kebersihan. Setiap layanan memiliki konfigurasi Work Order yang berbeda sesuai kebutuhan perusahaan.",
		type: "TEXT",
		file_url: null,
		nime_type: null,
		size: null,
		created_at: "2026-05-03T09:15:00Z",
	},
	{
		id: 4,
		title: "SOP Keselamatan Kerja.pdf",
		content: "",
		type: "PDF",
		file_url: "https://example.com/sop-keselamatan.pdf",
		nime_type: "application/pdf",
		size: 512000,
		created_at: "2026-05-04T14:00:00Z",
	},
	{
		id: 5,
		title: "Berapa lama proses persetujuan Work Order?",
		content:
			"Proses persetujuan Work Order bergantung pada konfigurasi layanan. Jika approval diatur ke 'auto', Work Order langsung disetujui. Jika diatur ke 'manager', proses persetujuan membutuhkan waktu 1–2 hari kerja.",
		type: "TEXT",
		file_url: null,
		nime_type: null,
		size: null,
		created_at: "2026-05-05T11:00:00Z",
	},
];

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

/* ─── Compact Toggle ─────────────────────────────────────────────────────── */

interface CompactToggleProps {
	isActive: boolean;
	submitting: boolean;
	onToggle: (val: boolean) => void;
}

const CompactToggle = ({
	isActive,
	submitting,
	onToggle,
}: CompactToggleProps) => {
	const { showDialog } = useDialogStore();

	const handleToggle = (checked: boolean) => {
		showDialog({
			title: checked ? "Aktifkan FAQ Publik?" : "Nonaktifkan FAQ Publik?",
			description: checked
				? "FAQ akan dapat dilihat oleh semua pengguna publik setelah diaktifkan."
				: "FAQ tidak akan terlihat oleh pengguna publik setelah dinonaktifkan.",
			confirmText: checked ? "Aktifkan" : "Nonaktifkan",
			cancelText: "Batal",
			onConfirm: () => onToggle(checked),
		});
	};

	return (
		<div className="flex items-center gap-3 px-3 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
			<Label
				htmlFor="faq-active-switch"
				className={`text-xs font-bold transition-colors duration-200 ${
					isActive ? "text-emerald-600" : "text-slate-500"
				}`}>
				{isActive ? "FAQ Aktif" : "FAQ Nonaktif"}
			</Label>
			<Switch
				id="faq-active-switch"
				checked={isActive}
				onCheckedChange={handleToggle}
				disabled={submitting}
				className="data-[state=checked]:bg-emerald-500"
			/>
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

// NOTE: Set ke `true` untuk memakai mock data, ganti ke `false` saat endpoint sudah siap
const USE_MOCK = true;

const ViewFaq = () => {
	const {
		faqItems: apiFaqItems,
		isActive: apiIsActive,
		loading,
		submitting,
		error,
		fetchFaqList,
		handleToggleActive: apiToggle,
		handleAddText,
		handleAddPdf,
		handleDelete: apiDelete,
	} = useFaq();

	// ── Mock state ──
	const [mockItems, setMockItems] = useState<FaqItem[]>(MOCK_FAQ_ITEMS);
	const [mockIsActive, setMockIsActive] = useState(true);

	const faqItems = USE_MOCK ? mockItems : apiFaqItems;
	const isActive = USE_MOCK ? mockIsActive : apiIsActive;

	const handleToggleActive =
		USE_MOCK ? (val: boolean) => setMockIsActive(val) : apiToggle;

	const handleDelete =
		USE_MOCK ?
			async (id: number) => {
				setMockItems((prev) => prev.filter((item) => item.id !== id));
			}
		:	apiDelete;

	const [showDialog, setShowDialog] = useState(false);
	const [filter, setFilter] = useState<FilterType>("all");

	useEffect(() => {
		if (!USE_MOCK) void fetchFaqList();
	}, [fetchFaqList]);

	const textItems = faqItems.filter((i) => i.type === "TEXT");
	const pdfItems = faqItems.filter((i) => i.type === "PDF");
	const filteredItems =
		filter === "all" ? faqItems : faqItems.filter((i) => i.type === filter);

	// ── Mock submit handlers ──
	const handleAddTextMock = async (data: FaqTextRequest): Promise<boolean> => {
		setMockItems((prev) => [
			{
				id: Date.now(),
				title: data.title,
				content: data.content,
				type: "TEXT",
				file_url: null,
				nime_type: null,
				size: null,
				created_at: new Date().toISOString(),
			},
			...prev,
		]);
		return true;
	};

	const handleAddPdfMock = async (data: FaqFileRequest): Promise<boolean> => {
		setMockItems((prev) => [
			{
				id: Date.now(),
				title: data.title,
				content: "",
				type: "PDF",
				file_url: URL.createObjectURL(data.file),
				nime_type: "application/pdf",
				size: data.file.size,
				created_at: new Date().toISOString(),
			},
			...prev,
		]);
		return true;
	};

	if (!USE_MOCK && error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			{/* ── Page Header ── */}
			<PageHeader
				title="Kelola FAQ"
				subtitle="Kelola pertanyaan umum dan dokumen referensi untuk publik"
				actionButtons={
					<div className="flex items-center gap-3 w-full md:w-auto">
						{/* Toggle aktif — compact, pojok kiri area action */}
						<CompactToggle
							isActive={isActive}
							submitting={USE_MOCK ? false : submitting}
							onToggle={handleToggleActive}
						/>

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
					{!USE_MOCK && loading ?
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
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
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
										<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-rose-50 border border-slate-100 flex items-center justify-center">
											<FolderKanban className="w-8 h-8 text-slate-400" />
										</div>
										<div>
											<p className="text-base font-bold text-slate-700">
												Belum ada item FAQ
											</p>
											<p className="text-sm text-slate-400 mt-1">
												Mulai dengan menambahkan konten teks atau dokumen PDF.
											</p>
										</div>
										<Button
											onClick={() => setShowDialog(true)}
											className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm hover:cursor-pointer transition-all active:scale-95 flex items-center gap-2">
											<Plus className="w-4 h-4" />
											Tambah FAQ
										</Button>
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
				onSubmitText={USE_MOCK ? handleAddTextMock : handleAddText}
				onSubmitPdf={USE_MOCK ? handleAddPdfMock : handleAddPdf}
				submitting={USE_MOCK ? false : submitting}
			/>
		</div>
	);
};

export default ViewFaq;
