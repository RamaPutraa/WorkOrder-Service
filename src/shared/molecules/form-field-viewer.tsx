import { useState, useEffect } from "react";
import { useDialogStore } from "@/store/dialogStore";
import { Switch } from "@/components/ui/switch";
import {
	ImageIcon,
	Loader2,
	CheckCircle2,
	XCircle,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notifyError } from "@/lib/toast-helper";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AnswerValue = string | string[] | number | File | null;

interface Props {
	field: Field;
	answer: AnswerValue;
	onChange?: (value: AnswerValue) => void;
	readOnly?: boolean;
	index?: number;
}

// ── Field type label map ──────────────────────────────────────────────────────
const fieldTypeLabel: Record<string, string> = {
	text: "Jawaban singkat",
	textarea: "Paragraf",
	number: "Angka",
	date: "Tanggal",
	single_select: "Pilihan tunggal",
	multi_select: "Pilihan ganda",
	file: "File",
};

export default function FormFieldViewer({
	field,
	answer,
	onChange,
	readOnly = false,
	index,
}: Props) {
	const { showDialog } = useDialogStore();
	const [localValue, setLocalValue] = useState<AnswerValue>(answer);
	const [uploadState, setUploadState] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [selectedFileName, setSelectedFileName] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		setLocalValue(answer);
	}, [answer]);

	const handleValueChange = (newValue: AnswerValue) => {
		if (readOnly) return;
		setLocalValue(newValue);
		onChange?.(newValue);
	};

	const renderField = () => {
		switch (field.type) {
			case "text":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<Input
						type="text"
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || undefined}
						readOnly={readOnly}
						disabled={readOnly}
						className="bg-background"
					/>
				);

			case "number":
				return (
					<div className="mb-4 flex flex-col gap-1.5 w-full">
						{/* 1. Main Input Field (Tetap jadi fokus utama) */}
						<Input
								type="number"
								value={localValue !== null ? String(localValue) : ""}
								onKeyDown={(e) => {
									const isControlKey = [
										"Backspace",
										"Tab",
										"Delete",
										"Enter",
										"Escape",
										"ArrowLeft",
										"ArrowRight",
										"Home",
										"End",
									].includes(e.key);

									const isModifierKey = e.ctrlKey || e.metaKey;
									const isNumberOrDecimal = /^[0-9.]$/.test(e.key);

									if (!isControlKey && !isModifierKey && !isNumberOrDecimal) {
										e.preventDefault();
									}
								}}
								onChange={(e) => {
									const val = e.target.value;
									handleValueChange(val === "" ? null : Number(val));
								}}
								min={field.min ?? undefined}
								max={field.max ?? undefined}
								placeholder={field.placeholder || "Masukkan angka..."}
								readOnly={readOnly}
								disabled={readOnly}
								className="w-full bg-background"
							/>

						{/* 2. Min/Max Information Text (Kecil, rapi, dan tidak menyerupai form) */}
						{(field.min != null || field.max != null) && (
							<div className="flex items-center gap-2 px-2 py-2 bg-muted/30 border border-border/60 rounded-lg w-fit">
								{field.min != null && (
									<span className="text-[11px] text-muted-foreground">
										Min:{" "}
										<span className="font-medium text-foreground/80">
											{field.min}
										</span>
									</span>
								)}

								{/* Pemisah titik bullet jika Min dan Max keduanya ada */}
								{field.min != null && field.max != null && (
									<span className="text-[10px] text-muted-foreground/40">
										●
									</span>
								)}

								{field.max != null && (
									<span className="text-[11px] text-muted-foreground">
										Maks:{" "}
										<span className="font-medium text-foreground/80">
											{field.max}
										</span>
									</span>
								)}
							</div>
						)}
					</div>
				);

			case "textarea":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<Textarea
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || undefined}
						readOnly={readOnly}
						disabled={readOnly}
						rows={4}
						className={`min-h-[96px] bg-background ${readOnly ? "resize-none" : "resize-y"}`}
					/>
				);

			case "date":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<Input
						type="date"
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						readOnly={readOnly}
						disabled={readOnly}
						className="bg-background"
					/>
				);

			case "single_select":
				return (
					<div className="flex flex-col gap-1.5">
						{field.options?.map((opt) => {
							const val = opt.key ?? opt.value;
							const checked = localValue === val;
							return (
								<label
									key={val}
									className={[
										"flex items-center gap-3 px-3 py-2.5 rounded-md border text-sm transition-all",
										checked ?
											"border-primary/50 bg-primary/5 text-primary font-medium"
										:	"border-border/60 bg-transparent text-foreground",
										readOnly ?
											"cursor-default opacity-80"
										:	"cursor-pointer hover:bg-muted/50",
									].join(" ")}>
									<span
										className={[
											"flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
											checked ?
												"border-primary bg-primary"
											:	"border-muted-foreground/40",
										].join(" ")}>
										{checked && (
											<span className="w-1.5 h-1.5 rounded-full bg-white block" />
										)}
									</span>
									<input
										type="radio"
										checked={checked}
										onChange={() => handleValueChange(val)}
										disabled={readOnly}
										className="sr-only"
									/>
									{opt.value}
								</label>
							);
						})}
					</div>
				);

			case "multi_select":
				return (
					<div className="flex flex-col gap-1.5">
						{field.options?.map((opt) => {
							const val = opt.key ?? opt.value;
							let arr: any[] = [];
							if (Array.isArray(localValue)) {
								arr = localValue;
							} else if (localValue != null && localValue !== "") {
								if (
									typeof localValue === "string" &&
									localValue.startsWith("[") &&
									localValue.endsWith("]")
								) {
									try {
										arr = JSON.parse(localValue);
									} catch {
										arr = [localValue];
									}
								} else if (
									typeof localValue === "string" &&
									localValue.includes(",")
								) {
									arr = localValue.split(",").map((s) => s.trim());
								} else {
									arr = [String(localValue)];
								}
							}

							const checked = arr.includes(val) || arr.includes(String(val));

							const toggle = () => {
								if (readOnly) return;
								handleValueChange(
									checked ?
										arr.filter((v) => v !== val && String(v) !== String(val))
									:	[...arr, val],
								);
							};

							return (
								<label
									key={val}
									className={[
										"flex items-center gap-3 px-3 py-2.5 rounded-md border text-sm transition-all",
										checked ?
											"border-primary/50 bg-primary/5 text-primary font-medium"
										:	"border-border/60 bg-transparent text-foreground",
										readOnly ?
											"cursor-default opacity-80"
										:	"cursor-pointer hover:bg-muted/50",
									].join(" ")}>
									<span
										className={[
											"flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
											checked ?
												"border-primary bg-primary"
											:	"border-muted-foreground/40",
										].join(" ")}>
										{checked && (
											<svg
												className="w-2.5 h-2.5 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={3}>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										)}
									</span>
									<input
										type="checkbox"
										checked={checked}
										onChange={toggle}
										disabled={readOnly}
										className="sr-only"
									/>
									{opt.value}
								</label>
							);
						})}
					</div>
				);

			case "image": {
				const hasFile =
					uploadState !== "idle" ||
					(typeof localValue === "string" && localValue) ||
					localValue instanceof File;

				const handleFileUpload = async (file: File) => {
					setSelectedFileName(file.name);
					setUploadState("uploading");
					setUploadProgress(15);

					// Animasi progress bar palsu agar UI tetap interaktif
					const timer = setInterval(() => {
						setUploadProgress((p) =>
							p < 90 ? p + Math.floor(Math.random() * 20) : p,
						);
					}, 150);

					// Jeda buatan selama ~800ms
					await new Promise((resolve) => setTimeout(resolve, 800));

					clearInterval(timer);
					setUploadProgress(100);

					setTimeout(() => {
						setUploadState("success");
						handleValueChange(file);
					}, 300);
				};

				return (
					<div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-border/60 bg-muted/30 text-sm">
						{hasFile ?
							<div className="flex items-center gap-3 w-full p-2">
								{/* 1. KIRI: Ikon Gambar */}
								<div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
									<ImageIcon className="w-5 h-5" />
								</div>

								{/* 2. TENGAH: Nama File, Status Spinner & Progress Bar */}
								<div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
									{/* Baris Atas Area Tengah: Teks & Spinner */}
									<div className="flex items-center justify-between">
										<div className="text-sm font-medium text-foreground truncate">
											{/* Tampilkan nama file saat uploading agar layout tidak kempes */}
											{uploadState === "uploading" ?
												<span className="text-muted-foreground">
													{selectedFileName || "Mengunggah..."}
												</span>
											: (
												uploadState === "success" ||
												(uploadState === "idle" &&
													((typeof localValue === "string" && localValue) ||
														localValue instanceof File))
											) ?
												<>
													<button
														type="button"
														onClick={() => setIsPreviewOpen(true)}
														className="text-sm text-primary hover:underline font-medium inline-flex items-center cursor-pointer">
														Lihat File Gambar
													</button>

													<Dialog
														open={isPreviewOpen}
														onOpenChange={setIsPreviewOpen}>
														<DialogContent className="max-w-3xl p-1 overflow-hidden border-none bg-transparent shadow-none flex items-center justify-center">
															<DialogHeader className="sr-only">
																<DialogTitle>Preview Gambar</DialogTitle>
															</DialogHeader>
															<div className="relative w-full h-full flex items-center justify-center">
																<img
																	src={
																		localValue instanceof File ?
																			URL.createObjectURL(localValue)
																		:	(localValue as string)
																	}
																	alt="Preview"
																	className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform"
																/>
															</div>
														</DialogContent>
													</Dialog>
												</>
											:	null}
										</div>

										{/* Ikon Status */}
										<div className="shrink-0 flex items-center gap-2 ml-3">
											{uploadState === "uploading" && (
												<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
											)}
											{uploadState === "success" && (
												<CheckCircle2 className="w-4 h-4 text-green-500" />
											)}
											{uploadState === "error" && (
												<XCircle className="w-4 h-4 text-red-500" />
											)}
											{uploadState === "idle" &&
												((typeof localValue === "string" && localValue) ||
													localValue instanceof File) && (
													<CheckCircle2 className="w-4 h-4 text-green-500" />
												)}
										</div>
									</div>

									{/* Baris Bawah Area Tengah: Progress bar */}
									{uploadState === "uploading" && (
										<div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary transition-all duration-300 ease-out"
												style={{ width: `${uploadProgress}%` }}
											/>
										</div>
									)}

									{uploadState === "error" && (
										<p className="text-[11px] text-red-500 font-medium leading-none">
											Gagal mengunggah gambar
										</p>
									)}
								</div>

								{/* 3. KANAN: Tombol Hapus (Akan muncul saat idle/success/error) */}
								{!readOnly &&
									(uploadState === "idle" ||
										uploadState === "success" ||
										uploadState === "error") && (
										<div className="shrink-0 ml-2 border-l pl-3 border-border/50">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													showDialog({
														title: "Hapus Gambar",
														description:
															"Apakah Anda yakin ingin menghapus gambar ini? Perubahan akan permanen setelah Anda menekan tombol Simpan.",
														confirmText: "Hapus",
														cancelText: "Batal",
														onConfirm: () => {
															handleValueChange(null);
															setUploadState("idle");
															setSelectedFileName("");
															setUploadProgress(0);
														},
													});
												}}
												className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									)}
							</div>
						:	<div className="space-y-1.5 w-full">
								<div
									className={[
										"flex flex-col items-center justify-center gap-2 p-5 w-full rounded-xl border-2 border-dashed transition-all relative overflow-hidden",
										isDragging ?
											"border-primary bg-primary/5 scale-[0.99] shadow-sm"
										:	"border-muted bg-muted/5 hover:bg-muted/10",
									].join(" ")}
									onDragOver={(e) => {
										if (readOnly) return;
										e.preventDefault();
										setIsDragging(true);
									}}
									onDragLeave={(e) => {
										if (readOnly) return;
										e.preventDefault();
										setIsDragging(false);
									}}
									onDrop={async (e) => {
										if (readOnly) return;
										e.preventDefault();
										setIsDragging(false);

										const file = e.dataTransfer.files?.[0];
										if (!file) return;

										const validTypes = ["image/jpeg", "image/png", "image/jpg"];
										if (!validTypes.includes(file.type)) {
											notifyError(
												"Tipe File Tidak Valid",
												"Harap unggah file berformat JPG, JPEG, atau PNG.",
											);
											return;
										}

										if (file.size > 5 * 1024 * 1024) {
											notifyError(
												"File Terlalu Besar",
												"Ukuran file maksimal adalah 5MB.",
											);
											return;
										}

										await handleFileUpload(file);
									}}>
									<div
										className={`p-2 rounded-xl transition-colors ${isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
										<ImageIcon className="w-5 h-5" />
									</div>
									<span
										className={`text-xs font-medium tracking-wider text-center ${isDragging ? "text-primary" : ""}`}>
										{isDragging ?
											"Lepaskan gambar di sini..."
										:	"Klik untuk unggah atau seret & letakkan"}
									</span>
									<span className="text-xs text-muted-foreground font-medium tracking-wider text-center">
										JPG, JPEG, PNG (maksimal 5MB)
									</span>
									{!readOnly && (
										<div className="mt-1 w-full flex justify-center">
											<input
												type="file"
												accept="image/jpeg, image/png, image/jpg"
												className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												onChange={async (e) => {
													const file = e.target.files?.[0];
													if (file) {
														const validTypes = [
															"image/jpeg",
															"image/png",
															"image/jpg",
														];
														if (!validTypes.includes(file.type)) {
															notifyError(
																"Tipe File Tidak Valid",
																"Harap unggah file berformat JPG, JPEG, atau PNG.",
															);
															return;
														}
														if (file.size > 5 * 1024 * 1024) {
															notifyError(
																"File Terlalu Besar",
																"Ukuran file maksimal adalah 5MB.",
															);
															return;
														}
														await handleFileUpload(file);
													}
												}}
												disabled={readOnly}
											/>
										</div>
									)}
								</div>
							</div>
						}
					</div>
				);
			}

			default:
				return (
					<p className="text-sm text-muted-foreground italic px-3 py-2.5 bg-muted/30 rounded-md border border-border/40">
						Tipe field tidak diketahui: {field.type}
					</p>
				);
		}
	};

	return (
		<div className="rounded-xl shadow-sm border overflow-hidden transition-shadow ">
			{/* Header strip */}
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/20">
				<div className="flex items-center gap-2">
					{index != null && (
						<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
							{index}
						</span>
					)}
				</div>

				<div className="flex items-center gap-2.5">
					<span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium hidden sm:block">
						{fieldTypeLabel[field.type] ?? field.type}
					</span>
					<div className="flex items-center gap-1.5 bg-muted/60 px-2 py-0.5 rounded-full border border-border/40">
						<span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
							{field.required ? "Wajib" : "Opsional"}
						</span>
						<Switch
							checked={field.required}
							disabled
							className="scale-[0.6] -mr-0.5 data-[state=checked]:bg-primary"
						/>
					</div>
				</div>
			</div>

			<div className="px-4 py-2">
				<span className="text-sm font-medium text-foreground leading-tight">
					{field.label || "Tanpa Judul"}
				</span>
			</div>
			{/* Field content — only shown if there's something to render */}
			{renderField() != null && (
				<div className="px-4 pb-3">{renderField()}</div>
			)}
		</div>
	);
}
