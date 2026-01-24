import { useState, useEffect } from "react";

export type AnswerValue = string | string[] | number | File | null;

interface Props {
	field: Field;
	answer: AnswerValue;
	onChange?: (value: AnswerValue) => void;
	readOnly?: boolean;
}

export default function FormFieldViewer({
	field,
	answer,
	onChange,
	readOnly = false,
}: Props) {
	const [localValue, setLocalValue] = useState<AnswerValue>(answer);

	useEffect(() => {
		setLocalValue(answer);
	}, [answer]);

	// Notify parent when value changes
	const handleValueChange = (newValue: AnswerValue) => {
		if (readOnly) return; // Prevent changes in read-only mode
		setLocalValue(newValue);
		onChange?.(newValue);
	};

	const baseInput = `w-full px-4 py-2.5 text-sm border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${
		readOnly ? "bg-muted/50 cursor-not-allowed opacity-70" : ""
	}`;

	const renderField = () => {
		switch (field.type) {
			case "text":
			case "email":
			case "password":
				return (
					<input
						type={field.type}
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || "Masukkan teks"}
						readOnly={readOnly}
						disabled={readOnly}
						className={baseInput}
					/>
				);

			case "number":
				return (
					<input
						type="number"
						value={localValue !== null ? String(localValue) : ""}
						onChange={(e) => {
							const newValue =
								e.target.value === "" ? null : Number(e.target.value);
							handleValueChange(newValue);
						}}
						placeholder={field.placeholder || "Masukkan angka"}
						readOnly={readOnly}
						disabled={readOnly}
						className={baseInput}
					/>
				);

			case "textarea":
				return (
					<textarea
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || "Masukkan teks panjang"}
						readOnly={readOnly}
						disabled={readOnly}
						className={`${baseInput} min-h-[100px] resize-y`}
					/>
				);

			case "date":
				return (
					<input
						type="date"
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || ""}
						readOnly={readOnly}
						disabled={readOnly}
						className={baseInput}
					/>
				);

			case "single_select":
				return (
					<div className="space-y-2.5">
						{field.options?.map((opt) => (
							<label
								key={opt.key ?? opt.value}
								className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
									readOnly ?
										"cursor-not-allowed opacity-70"
									:	"hover:bg-background cursor-pointer"
								}`}>
								<input
									type="radio"
									checked={localValue === opt.value}
									onChange={() => handleValueChange(opt.value)}
									disabled={readOnly}
									className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
								/>
								<span
									className={`text-sm font-medium transition-colors ${
										readOnly ? "" : "group-hover:text-primary"
									}`}>
									{opt.value}
								</span>
							</label>
						))}
					</div>
				);

			case "multi_select":
				return (
					<div className="space-y-2.5">
						{field.options?.map((opt) => {
							const arr = Array.isArray(localValue) ? localValue : [];

							const toggle = () => {
								if (readOnly) return;
								if (arr.includes(opt.value)) {
									handleValueChange(arr.filter((v) => v !== opt.value));
								} else {
									handleValueChange([...arr, opt.value]);
								}
							};

							return (
								<label
									key={opt.key ?? opt.value}
									className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
										readOnly ?
											"cursor-not-allowed opacity-70"
										:	"hover:bg-background cursor-pointer"
									}`}>
									<input
										type="checkbox"
										checked={arr.includes(opt.value)}
										onChange={toggle}
										disabled={readOnly}
										className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
									/>
									<span
										className={`text-sm font-medium transition-colors ${
											readOnly ? "" : "group-hover:text-primary"
										}`}>
										{opt.value}
									</span>
								</label>
							);
						})}
					</div>
				);

			case "file":
				return (
					<div className="p-4 border rounded-lg bg-muted/30">
						{typeof localValue === "string" ?
							<a
								href={localValue}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors underline">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
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
						:	<p className="text-sm text-muted-foreground">
								Tidak ada file yang diunggah
							</p>
						}
					</div>
				);

			default:
				return (
					<p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
						Tipe field tidak diketahui: {field.type}
					</p>
				);
		}
	};

	return (
		<div className="space-y-3">
			<label className="block text-sm font-semibold text-foreground">
				{field.label}
				{field.required && <span className="text-destructive ml-1">*</span>}
			</label>
			{renderField()}
		</div>
	);
}
