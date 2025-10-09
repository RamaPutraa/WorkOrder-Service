import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldNumber: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="grid grid-cols-2 gap-4">
		<div className="space-y-2">
			<Label>Min</Label>
			<Input
				type="number"
				value={field.min ?? ""}
				onChange={(e) =>
					onUpdate({ min: e.target.value ? Number(e.target.value) : null })
				}
			/>
		</div>
		<div className="space-y-2">
			<Label>Max</Label>
			<Input
				type="number"
				value={field.max ?? ""}
				onChange={(e) =>
					onUpdate({ max: e.target.value ? Number(e.target.value) : null })
				}
			/>
		</div>
	</div>
);
