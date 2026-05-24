import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, UploadCloud, FileText, Upload, AlertCircle } from "lucide-react";
import { useCreateMembercode } from "../hooks/useCreateMembercode";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface UploadMembercodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export const UploadMembercodeDialog: React.FC<UploadMembercodeDialogProps> = ({
	open,
	onOpenChange,
	onSuccess,
}) => {
	const { createMembercode, loading } = useCreateMembercode();

	const [file, setFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const resetAll = () => {
		setFile(null);
		setError(null);
		setDragActive(false);
	};

	const handleClose = () => {
		resetAll();
		onOpenChange(false);
	};

	// Reset form when dialog closes
	React.useEffect(() => {
		if (!open) {
			resetAll();
		}
	}, [open]);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setDragActive(false);
		const dropped = e.dataTransfer.files[0];
		if (dropped) setFile(dropped);
	}, []);

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const onSubmit = async () => {
		if (!file) {
			setError("File CSV wajib diunggah.");
			return;
		}

		if (!file.name.endsWith('.csv') && file.type !== "text/csv") {
			setError("File harus berformat CSV.");
			return;
		}

		setError(null);

		const success = await createMembercode({ file: file });
		if (success) {
			handleClose();
			if (onSuccess) onSuccess();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* ── Gradient Header ── */}
				<div className="px-6 py-5 transition-all duration-300 bg-gradient-to-br from-blue-600 to-blue-500">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-white">
							<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
								<UploadCloud className="w-5 h-5" />
							</div>
							<span className="text-lg font-bold">Unggah Data Pelanggan</span>
						</DialogTitle>
					</DialogHeader>
					<p className="text-white/80 text-sm mt-2 font-medium">
						Unggah file CSV yang berisi data pelanggan untuk di-generate token berlangganannya.
					</p>
				</div>

				{/* ── Form Body ── */}
				<AnimatePresence mode="wait">
					<motion.div
						key="upload-form"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.18 }}
						className="px-6 py-5 space-y-5 bg-white">

						<div className="bg-primary/5 rounded-xl p-4 text-sm text-slate-600 border border-primary/10 leading-relaxed">
							<p className="font-bold text-primary mb-1.5">Format CSV yang didukung:</p>
							<ul className="list-disc list-inside space-y-1 ml-1 text-xs">
								<li><span className="font-mono px-1 py-0.5 rounded text-slate-700 ">externalCustomerEmail</span></li>
								<li><span className="font-mono px-1 py-0.5 rounded text-slate-700 ">externalCustomerName</span></li>
							</ul>
						</div>

						{/* File Drop Zone */}
						<div className="space-y-1.5">
							<div
								onDragOver={(e) => {
									e.preventDefault();
									setDragActive(true);
								}}
								onDragLeave={() => setDragActive(false)}
								onDrop={handleDrop}
								onClick={() => fileRef.current?.click()}
								className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${dragActive ? "border-blue-400 bg-blue-50"
									: file ? "border-blue-400 bg-blue-50"
										: error ? "border-red-400 bg-red-50"
											: "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
									}`}>
								<input
									ref={fileRef}
									id="membercode-csv-file"
									type="file"
									accept=".csv,text/csv"
									className="hidden"
									onChange={(e) => {
										const f = e.target.files?.[0];
										if (f) {
											setFile(f);
											setError(null);
										}
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
										: <motion.div
											key="upload-placeholder"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="space-y-2">
											<div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
												<Upload className="w-6 h-6 text-slate-400" />
											</div>
											<p className="text-sm text-slate-600 font-medium">
												Klik atau seret file CSV ke sini
											</p>
											<p className="text-xs text-slate-400">Format: CSV</p>
										</motion.div>
									}
								</AnimatePresence>
							</div>
							<AnimatePresence>
								{error && (
									<motion.p
										initial={{ opacity: 0, y: -4 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -4 }}
										className="text-xs text-red-500 flex items-center gap-1 mt-2">
										<AlertCircle className="w-3 h-3" />
										{error}
									</motion.p>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</AnimatePresence>

				{/* ── Footer ── */}
				<div className="px-6 pb-6 pt-2 bg-white flex gap-3">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={loading}
						className="flex-1 h-11 rounded-xl border-slate-200 font-semibold hover:bg-slate-50 hover:cursor-pointer">
						Batal
					</Button>
					<Button
						onClick={onSubmit}
						disabled={loading}
						className="flex-1 h-11 rounded-xl text-white font-semibold transition-all active:scale-95 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200">
						{loading ?
							<span className="flex items-center gap-2">
								<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
								Mengunggah...
							</span>
							: "Unggah & Generate"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
