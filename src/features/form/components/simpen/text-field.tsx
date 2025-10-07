// src/components/form-fields/TextField.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

export interface TextFieldProps {
	label: string;
	placeholder: string;
	onLabelChange: (val: string) => void;
	onPlaceholderChange: (val: string) => void;
	onRemoveField: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
	label,
	placeholder,
	onLabelChange,
	onPlaceholderChange,
	onRemoveField,
}) => {
	return (
		<div className="border p-4 rounded-lg space-y-3 bg-white shadow-sm">
			<div className="flex justify-between items-center">
				<h4 className="font-medium">{label || "Text Field"}</h4>
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
			</div>
		</div>
	);
};

export default TextField;
