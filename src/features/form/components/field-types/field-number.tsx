import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldNumber: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="grid grid-cols-3 gap-4">
		<div className="space-y-2">
			<Label>Min</Label>
			<Input
				type="number"
				className="focus-visible:ring-0 focus-visible:border-primary"
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
				className="focus-visible:ring-0 focus-visible:border-primary"
				value={field.max ?? ""}
				onChange={(e) =>
					onUpdate({ max: e.target.value ? Number(e.target.value) : null })
				}
			/>
		</div>
	</div>
);
