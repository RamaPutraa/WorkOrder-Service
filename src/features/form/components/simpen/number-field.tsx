import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

export interface NumberFieldProps {
	label: string;
	placeholder: string;
	min?: number;
	max?: number;
	onLabelChange: (val: string) => void;
	onPlaceholderChange: (val: string) => void;
	onMinChange: (val: number) => void;
	onMaxChange: (val: number) => void;
	onRemoveField: () => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
	label,
	placeholder,
	min,
	max,
	onLabelChange,
	onPlaceholderChange,
	onMinChange,
	onMaxChange,
	onRemoveField,
}) => {
	return (
		<div className="border p-4 rounded-lg space-y-3 bg-white shadow-sm">
			<div className="flex justify-between items-center">
				<h4 className="font-medium">{label || "Number Field"}</h4>
				<button
					type="button"
					onClick={onRemoveField}
					className="text-red-500 hover:text-red-600">
					<Trash2 className="h-4 w-4" />
				</button>
			</div>

			<div className="space-y-2">
				<div>
					<Label>Label</Label>
					<Input
						value={label}
						onChange={(e) => onLabelChange(e.target.value)}
						placeholder="Masukkan label"
					/>
				</div>

				<div>
					<Label>Placeholder</Label>
					<Input
						value={placeholder}
						onChange={(e) => onPlaceholderChange(e.target.value)}
						placeholder="Masukkan placeholder"
					/>
				</div>

				<div className="flex gap-3">
					<div className="flex-1">
						<Label>Min</Label>
						<Input
							type="number"
							value={min ?? ""}
							onChange={(e) => onMinChange(Number(e.target.value))}
							placeholder="Nilai minimum"
						/>
					</div>
					<div className="flex-1">
						<Label>Max</Label>
						<Input
							type="number"
							value={max ?? ""}
							onChange={(e) => onMaxChange(Number(e.target.value))}
							placeholder="Nilai maksimum"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NumberField;
