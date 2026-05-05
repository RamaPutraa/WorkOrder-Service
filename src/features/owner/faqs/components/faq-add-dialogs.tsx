import { useState, useRef, useCallback } from "react";
import { X, FileText, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────── Unified Add FAQ Dialog ─────────────────────── */

type Tab = "text" | "pdf";

interface AddFaqDialogProps {
	open: boolean;
	onClose: () => void;
	onSubmitText: (data: FaqTextRequest) => Promise<boolean>;
	onSubmitPdf: (data: FaqFileRequest) => Promise<boolean>;
	submitting: boolean;
}

export function AddFaqDialog({
	open,
	onClose,
	onSubmitText,
	onSubmitPdf,
	submitting,
}: AddFaqDialogProps) {
	const [activeTab, setActiveTab] = useState<Tab>("text");

	// ── Text state ──
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [textErrors, setTextErrors] = useState<{
		title?: string;
		content?: string;
	}>({});

	// ── PDF state ──
	const [pdfTitle, setPdfTitle] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [pdfErrors, setPdfErrors] = useState<{ title?: string; file?: string }>(
		{},
	);
	const fileRef = useRef<HTMLInputElement>(null);

	const resetAll = () => {
		setTitle("");
		setContent("");
		setTextErrors({});
		setPdfTitle("");
		setFile(null);
		setPdfErrors({});
		setDragActive(false);
	};

	const handleClose = () => {
		resetAll();
		onClose();
	};

	const handleTabChange = (tab: Tab) => {
		setActiveTab(tab);
	};

	// ── Text submit ──
	const handleTextSubmit = async () => {
		const errs: typeof textErrors = {};
		if (!title.trim()) errs.title = "Judul tidak boleh kosong.";
		if (!content.trim()) errs.content = "Konten tidak boleh kosong.";
		setTextErrors(errs);
		if (Object.keys(errs).length > 0) return;

		const ok = await onSubmitText({
			title: title.trim(),
			content: content.trim(),
		});
		if (ok) {
			resetAll();
			onClose();
		}
	};

	// ── PDF submit ──
	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);
		const dropped = e.dataTransfer.files[0];
		if (dropped) setFile(dropped);
	}, []);

	const handlePdfSubmit = async () => {
		const errs: typeof pdfErrors = {};
		if (!pdfTitle.trim()) errs.title = "Judul tidak boleh kosong.";
		if (!file) errs.file = "File PDF wajib diunggah.";
		else if (file.type !== "application/pdf")
			errs.file = "File harus berformat PDF.";
		setPdfErrors(errs);
		if (Object.keys(errs).length > 0) return;

		const ok = await onSubmitPdf({ title: pdfTitle.trim(), file: file! });
		if (ok) {
			resetAll();
			onClose();
		}
	};

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const isText = activeTab === "text";

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* ── Gradient Header ── */}
				<div className="px-6 py-5 transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-500">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-white">
							<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
								{isText ?
									<FileText className="w-5 h-5" />
								:	<Upload className="w-5 h-5" />}
							</div>
							<span className="text-lg font-bold">Tambah Konten FAQ</span>
						</DialogTitle>
					</DialogHeader>

					{/* ── Tabs ── */}
					<div className="flex gap-2 mt-4">
						{(["text", "pdf"] as Tab[]).map((tab) => (
							<button
								key={tab}
								id={`faq-dialog-tab-${tab}`}
								onClick={() => handleTabChange(tab)}
								className={`flex items-center gap-2 px-4 h-8 rounded-full text-xs font-semibold transition-all duration-200 hover:cursor-pointer ${
									activeTab === tab ?
										"bg-white text-slate-800 shadow-md"
									:	"bg-white/20 text-white hover:bg-white/30"
								}`}>
								{tab === "text" ?
									<FileText className="w-3.5 h-3.5" />
								:	<Upload className="w-3.5 h-3.5" />}
								{tab === "text" ? "Teks" : "PDF"}
							</button>
						))}
					</div>
				</div>

				{/* ── Form Body ── */}
				<AnimatePresence mode="wait">
					{isText ?
						<motion.div
							key="text-form"
							initial={{ opacity: 0, x: -16 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 16 }}
							transition={{ duration: 0.18 }}
							className="px-6 py-5 space-y-4 bg-white">
							{/* Title */}
							<div className="space-y-1.5">
								<Label
									htmlFor="faq-text-title"
									className="text-sm font-semibold text-slate-700">
									Judul
								</Label>
								<Input
									id="faq-text-title"
									placeholder="Contoh: Bagaimana cara mendaftar?"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className={`h-10 rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-100 ${textErrors.title ? "border-red-400 focus:border-red-400" : ""}`}
								/>
								<AnimatePresence>
									{textErrors.title && (
										<motion.p
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -4 }}
											className="text-xs text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{textErrors.title}
										</motion.p>
									)}
								</AnimatePresence>
							</div>

							{/* Content */}
							<div className="space-y-1.5">
								<Label
									htmlFor="faq-text-content"
									className="text-sm font-semibold text-slate-700">
									Konten
								</Label>
								<Textarea
									id="faq-text-content"
									placeholder="Tuliskan penjelasan lengkap di sini..."
									value={content}
									onChange={(e) => setContent(e.target.value)}
									rows={5}
									className={`rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-100 resize-none ${textErrors.content ? "border-red-400 focus:border-red-400" : ""}`}
								/>
								<AnimatePresence>
									{textErrors.content && (
										<motion.p
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -4 }}
											className="text-xs text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{textErrors.content}
										</motion.p>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					:	<motion.div
							key="pdf-form"
							initial={{ opacity: 0, x: 16 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -16 }}
							transition={{ duration: 0.18 }}
							className="px-6 py-5 space-y-4 bg-white">
							{/* PDF Title */}
							<div className="space-y-1.5">
								<Label
									htmlFor="faq-pdf-title"
									className="text-sm font-semibold text-slate-700">
									Judul
								</Label>
								<Input
									id="faq-pdf-title"
									placeholder="Contoh: Panduan Penggunaan Layanan"
									value={pdfTitle}
									onChange={(e) => setPdfTitle(e.target.value)}
									className={`h-10 rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-100 ${pdfErrors.title ? "border-red-400" : ""}`}
								/>
								<AnimatePresence>
									{pdfErrors.title && (
										<motion.p
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -4 }}
											className="text-xs text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{pdfErrors.title}
										</motion.p>
									)}
								</AnimatePresence>
							</div>

							{/* File Drop Zone */}
							<div className="space-y-1.5">
								<Label className="text-sm font-semibold text-slate-700">
									File PDF
								</Label>
								<div
									onDragOver={(e) => {
										e.preventDefault();
										setDragActive(true);
									}}
									onDragLeave={() => setDragActive(false)}
									onDrop={handleDrop}
									onClick={() => fileRef.current?.click()}
									className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
										dragActive ? "border-blue-400 bg-blue-50"
										: file ? "border-blue-400 bg-blue-50"
										: pdfErrors.file ? "border-red-400 bg-red-50"
										: "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
									}`}>
									<input
										ref={fileRef}
										id="faq-pdf-file"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={(e) => {
											const f = e.target.files?.[0];
											if (f) setFile(f);
										}}
									/>
									<AnimatePresence mode="wait">
										{file ?
											<motion.div
												key="file-preview"
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.95 }}
												className="flex items-center justify-between gap-3">
												<div className="flex items-center gap-3 min-w-0">
													<div className="shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
														<FileText className="w-5 h-5 text-blue-500" />
													</div>
													<div className="min-w-0 text-left">
														<p className="text-sm font-semibold text-slate-700 truncate">
															{file.name}
														</p>
														<p className="text-xs text-slate-400">
															{formatSize(file.size)}
														</p>
													</div>
												</div>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setFile(null);
													}}
													className="shrink-0 p-1.5 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-500 transition-colors">
													<X className="w-4 h-4" />
												</button>
											</motion.div>
										:	<motion.div
												key="upload-placeholder"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className="space-y-2">
												<div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
													<Upload className="w-6 h-6 text-slate-400" />
												</div>
												<p className="text-sm text-slate-600 font-medium">
													Klik atau seret file PDF ke sini
												</p>
												<p className="text-xs text-slate-400">Format: PDF</p>
											</motion.div>
										}
									</AnimatePresence>
								</div>
								<AnimatePresence>
									{pdfErrors.file && (
										<motion.p
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -4 }}
											className="text-xs text-red-500 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{pdfErrors.file}
										</motion.p>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					}
				</AnimatePresence>

				{/* ── Footer ── */}
				<div className="px-6 pb-6 pt-2 bg-white border-t border-slate-100 flex gap-3">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={submitting}
						className="flex-1 h-11 rounded-xl border-slate-200 font-semibold hover:bg-slate-50 hover:cursor-pointer">
						Batal
					</Button>
					<Button
						onClick={isText ? handleTextSubmit : handlePdfSubmit}
						disabled={submitting}
						id="btn-submit-faq"
						className="flex-1 h-11 rounded-xl text-white font-semibold transition-all active:scale-95 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200">
						{submitting ?
							<span className="flex items-center gap-2">
								<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
								{isText ? "Menyimpan..." : "Mengunggah..."}
							</span>
						: isText ?
							"Simpan FAQ"
						:	"Unggah PDF"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
