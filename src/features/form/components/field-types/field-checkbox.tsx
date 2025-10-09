import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldCheckbox: React.FC<Props> = ({ field, onUpdate }) => {
	const options = field.options ?? [];

	const handleOptionChange = (index: number, value: string) => {
		const newOptions = options.map((opt, i) =>
			i === index ? { ...opt, value } : opt
		);
		onUpdate({ options: newOptions });
	};

	const handleAddOption = () => {
		onUpdate({ options: [...options, { value: "" }] });
	};

	const handleRemoveOption = (index: number) => {
		onUpdate({ options: options.filter((_, i) => i !== index) });
	};

	return (
		<div className="space-y-3">
			<Label>Opsi Checkbox</Label>
			{options.map((opt, idx) => (
				<div key={idx} className="flex gap-2">
					<Input
						value={opt.value}
						onChange={(e) => handleOptionChange(idx, e.target.value)}
						placeholder={`Opsi ${idx + 1}`}
					/>
					<Button
						variant="destructive"
						type="button"
						onClick={() => handleRemoveOption(idx)}>
						Hapus
					</Button>
				</div>
			))}
			<Button type="button" onClick={handleAddOption} variant="secondary">
				+ Tambah Opsi
			</Button>
		</div>
	);
};
