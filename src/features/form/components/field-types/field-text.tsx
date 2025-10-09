import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldText: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="space-y-2">
		<Label>Placeholder</Label>
		<Input
			value={field.placeholder ?? ""}
			onChange={(e) => onUpdate({ placeholder: e.target.value })}
			placeholder="Contoh: Masukkan nama"
		/>
	</div>
);
