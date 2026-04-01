import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

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
	const [localValue, setLocalValue] = useState<AnswerValue>(answer);

	useEffect(() => {
		setLocalValue(answer);
	}, [answer]);

	const handleValueChange = (newValue: AnswerValue) => {
		if (readOnly) return;
		setLocalValue(newValue);
		onChange?.(newValue);
	};

	// ── Shared input class ──────────────────────────────────────────────────────
	const inputCls = [
		"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
		"transition-colors placeholder:text-muted-foreground/50",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
		readOnly ?
			"bg-muted/40 cursor-not-allowed text-muted-foreground select-none pointer-events-none"
		:	"",
	]
		.filter(Boolean)
		.join(" ");

	const renderField = () => {
		switch (field.type) {
			case "text":
			case "email":
			case "password":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<input
						type={field.type}
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || undefined}
						readOnly={readOnly}
						disabled={readOnly}
						className={inputCls}
					/>
				);

			case "number":
				const hideNumberInput =
					readOnly && localValue == null && !field.placeholder;

				return (
					<div className="space-y-3">
						{!hideNumberInput && (
							<input
								type="number"
								value={localValue !== null ? String(localValue) : ""}
								onChange={(e) => {
									const v =
										e.target.value === "" ? null : Number(e.target.value);
									handleValueChange(v);
								}}
								min={field.min ?? undefined}
								max={field.max ?? undefined}
								placeholder={field.placeholder || undefined}
								readOnly={readOnly}
								disabled={readOnly}
								className={inputCls}
							/>
						)}

						{/* Min/max hints using input tags as requested */}
						{(field.min != null || field.max != null) && (
							<div className="flex items-center gap-4">
								{field.min != null && (
									<div className="flex items-center gap-2 w-full">
										<span className="text-xs font-medium text-muted-foreground">
											Min
										</span>
										<input
											type="number"
											value={field.min}
											disabled
											readOnly
											className="h-8 w-full px-2 rounded-md border border-input bg-muted/50 text-xs text-muted-foreground cursor-not-allowed"
										/>
									</div>
								)}
								{field.max != null && (
									<div className="flex items-center gap-2 w-full">
										<span className="text-xs font-medium text-muted-foreground">
											Maks
										</span>
										<input
											type="number"
											value={field.max}
											disabled
											readOnly
											className="h-8 w-full px-2 rounded-md border border-input bg-muted/50 text-xs text-muted-foreground cursor-not-allowed"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				);

			case "textarea":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<textarea
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || undefined}
						readOnly={readOnly}
						disabled={readOnly}
						rows={4}
						className={`${inputCls} min-h-[96px] ${readOnly ? "resize-none" : "resize-y"}`}
					/>
				);

			case "date":
				if (readOnly && !localValue && !field.placeholder) return null;
				return (
					<input
						type="date"
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						readOnly={readOnly}
						disabled={readOnly}
						className={inputCls}
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
							const arr = Array.isArray(localValue) ? localValue : [];
							const checked = arr.includes(val);

							const toggle = () => {
								if (readOnly) return;
								handleValueChange(
									checked ? arr.filter((v) => v !== val) : [...arr, val],
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

			case "file":
				return (
					<div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-border/60 bg-muted/30 text-sm">
						{typeof localValue === "string" && localValue ?
							<a
								href={localValue}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-primary hover:underline font-medium">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 shrink-0"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
										clipRule="evenodd"
									/>
								</svg>
								Lihat File
							</a>
						:	<span className="text-muted-foreground italic">
								Tidak ada file
							</span>
						}
					</div>
				);

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
					<span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium hidden sm:block">
						{`Pertanyaan ${index}`}
					</span>
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
