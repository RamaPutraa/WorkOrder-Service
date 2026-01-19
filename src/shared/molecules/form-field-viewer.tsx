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

	const baseInput = `w-full text-sm border rounded-md p-2 ${readOnly ? "bg-gray-50 cursor-not-allowed" : ""}`;

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
						placeholder={field.placeholder || ""}
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
						placeholder={field.placeholder || ""}
						className={baseInput}
					/>
				);

			case "textarea":
				return (
					<textarea
						value={(localValue as string) ?? ""}
						onChange={(e) => handleValueChange(e.target.value)}
						placeholder={field.placeholder || ""}
						readOnly={readOnly}
						disabled={readOnly}
						className={`${baseInput} min-h-[90px]`}
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
					<div className="space-y-1">
						{field.options?.map((opt) => (
							<label
								key={opt.key ?? opt.value}
								className="flex items-center gap-2">
								<input
									type="radio"
									checked={localValue === opt.value}
									onChange={() => handleValueChange(opt.value)}
								/>
								<span className="text-sm">{opt.value}</span>
							</label>
						))}
					</div>
				);

			case "multi_select":
				return (
					<div className="space-y-1">
						{field.options?.map((opt) => {
							const arr = Array.isArray(localValue) ? localValue : [];

							const toggle = () => {
								if (arr.includes(opt.value)) {
									handleValueChange(arr.filter((v) => v !== opt.value));
								} else {
									handleValueChange([...arr, opt.value]);
								}
							};

							return (
								<label
									key={opt.key ?? opt.value}
									className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={arr.includes(opt.value)}
										onChange={toggle}
									/>
									<span className="text-sm">{opt.value}</span>
								</label>
							);
						})}
					</div>
				);

			case "file":
				return (
					<div>
						{typeof localValue === "string" ?
							<a
								href={localValue}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline text-sm">
								Lihat File
							</a>
						:	<p className="text-gray-500 text-sm">Tidak ada file</p>}
					</div>
				);

			default:
				return (
					<p className="text-sm text-gray-500">
						Unknown field type: {field.type}
					</p>
				);
		}
	};

	return (
		<div className="space-y-1">
			<label className="text-xs font-semibold text-gray-700">
				{field.label}
			</label>
			{renderField()}
		</div>
	);
}
