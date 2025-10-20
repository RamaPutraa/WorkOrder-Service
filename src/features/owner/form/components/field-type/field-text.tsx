import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldText: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="space-y-2">
		{/* Teks jawaban singkat seperti di Google Form */}
		<Label>Placeholder</Label>
		<Input
			value={field.placeholder ?? ""}
			onChange={(e) => onUpdate({ placeholder: e.target.value })}
			placeholder="Teks jawaban singkat"
			className="py-5 focus-visible:ring-0 focus-visible:border-primary"
		/>
	</div>
);
