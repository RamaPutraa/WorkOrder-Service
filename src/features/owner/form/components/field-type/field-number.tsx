import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldNumber: React.FC<Props> = ({ field, onUpdate, error }) => {
	const [minError, setMinError] = useState<string>("");
	const [maxError, setMaxError] = useState<string>("");

	// Hanya izinkan karakter angka, minus, dan backspace
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const allowed = [
			"Backspace",
			"Delete",
			"Tab",
			"ArrowLeft",
			"ArrowRight",
			"Home",
			"End",
		];
		if (allowed.includes(e.key)) return;

		// Jangan biarkan turun ke negatif lewat ArrowDown jika sudah <= 0
		if (e.key === "ArrowDown" && Number(e.currentTarget.value || 0) <= 0) {
			e.preventDefault();
			return;
		}

		if (!/^\d$/.test(e.key)) {
			e.preventDefault();
		}
	};

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		let value = raw === "" ? null : Number(raw);

		// Mentok sampai 0 saja (tidak boleh minus)
		if (value !== null && value < 0) {
			value = 0;
		}

		setMinError("");

		if (value !== null && field.max !== null && field.max !== undefined && value > field.max) {
			setMinError("Min tidak boleh lebih besar dari Max");
		} else if (value !== null && !Number.isFinite(value)) {
			setMinError("Masukkan angka yang valid");
		}

		onUpdate({ min: value });
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		let value = raw === "" ? null : Number(raw);

		// Mentok sampai 0 saja (tidak boleh minus)
		if (value !== null && value < 0) {
			value = 0;
		}

		setMaxError("");

		if (value !== null && field.min !== null && field.min !== undefined && value < field.min) {
			setMaxError("Max tidak boleh lebih kecil dari Min");
		} else if (value !== null && !Number.isFinite(value)) {
			setMaxError("Masukkan angka yang valid");
		}

		onUpdate({ max: value });
	};

	return (
		<div className="space-y-1.5">
			<div className="grid grid-cols-2 gap-3 max-w-xs">
				<div className="space-y-1">
					<Label className="text-xs font-medium text-muted-foreground">
						Min (Opsional)
					</Label>
					<Input
						type="number"
						min={0}
						value={field.min ?? ""}
						onKeyDown={handleKeyDown}
						onChange={handleMinChange}
						className={`h-9 rounded-lg text-sm ${minError || error ? "border-red-400" : ""}`}
					/>
					{minError && (
						<p className="text-xs text-red-500 flex items-center gap-1">
							<AlertCircle className="w-3 h-3 shrink-0" />
							{minError}
						</p>
					)}
				</div>
				<div className="space-y-1">
					<Label className="text-xs font-medium text-muted-foreground">
						Max (Opsional)
					</Label>
					<Input
						type="number"
						min={0}
						value={field.max ?? ""}
						onKeyDown={handleKeyDown}
						onChange={handleMaxChange}
						className={`h-9 rounded-lg text-sm ${maxError || error ? "border-red-400" : ""}`}
					/>
					{maxError && (
						<p className="text-xs text-red-500 flex items-center gap-1">
							<AlertCircle className="w-3 h-3 shrink-0" />
							{maxError}
						</p>
					)}
				</div>
			</div>
			{error && (
				<p className="text-xs text-red-500 flex items-center gap-1">
					<AlertCircle className="w-3 h-3 shrink-0" />
					{error}
				</p>
			)}
		</div>
	);
};
