import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldText: React.FC<Props> = ({ field, onUpdate, error }) => (
	<div className="space-y-2">
		{/* Teks jawaban singkat seperti di Google Form */}
		<Label className={error ? "text-red-500" : ""}>Placeholder</Label>
		<Input
			value={field.placeholder ?? ""}
			onChange={(e) => onUpdate({ placeholder: e.target.value })}
			placeholder="Teks jawaban singkat"
			className={`py-5 ${
				error ? "border-red-500 focus-visible:ring-red-300" : ""
			}`}
		/>
		{error && <p className="text-sm text-red-500">{error}</p>}
	</div>
);
