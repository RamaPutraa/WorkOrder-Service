import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

export interface CheckboxFieldProps {
	id: string;
	label: string;
	options: { label: string; value: string }[];
	onChangeOption: (
		index: number,
		key: "label" | "value",
		value: string
	) => void;
	onRemoveOption: (index: number) => void;
	onAddOption: () => void;
	onRemoveField: () => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
	id,
	label,
	options,
	onChangeOption,
	onRemoveOption,
	onAddOption,
	onRemoveField,
}) => {
	return (
		<div className="border p-4 rounded-lg space-y-3 bg-white shadow-sm">
			<div className="flex justify-between items-center">
				<h4 className="font-medium">{label || "Checkbox Field"}</h4>
				<button
					type="button"
					onClick={onRemoveField}
					className="text-red-500 hover:text-red-600">
					<Trash2 className="h-4 w-4" />
				</button>
			</div>

			{/* List opsi */}
			<div className="space-y-2">
				{options.map((opt, index) => (
					<div
						key={index}
						className="flex items-center justify-between gap-2 border p-2 rounded">
						<div className="flex items-center gap-2 flex-1">
							<Checkbox id={`${id}-option-${index}`} />
							<Label
								htmlFor={`${id}-option-${index}`}
								className="text-sm font-normal flex-1">
								<input
									type="text"
									value={opt.label}
									onChange={(e) =>
										onChangeOption(index, "label", e.target.value)
									}
									placeholder="Label opsi"
									className="border rounded p-1 w-full"
								/>
							</Label>
						</div>
						<button
							type="button"
							onClick={() => onRemoveOption(index)}
							className="text-red-500 hover:text-red-600">
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>

			{/* Tambah opsi baru */}
			<button
				type="button"
				onClick={onAddOption}
				className="text-sm text-blue-500 hover:underline">
				+ Tambah Opsi
			</button>
		</div>
	);
};

export default CheckboxField;
