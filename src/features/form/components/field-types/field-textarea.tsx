import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldTextarea: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="space-y-2">
		<Label>Placeholder</Label>
		<Textarea
			value={field.placeholder ?? ""}
			onChange={(e) => onUpdate({ placeholder: e.target.value })}
			placeholder="Contoh: Masukkan deskripsi"
		/>
	</div>
);
