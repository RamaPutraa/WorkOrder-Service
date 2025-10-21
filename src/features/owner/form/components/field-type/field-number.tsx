import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldNumber: React.FC<Props> = ({ field, onUpdate, error }) => (
	<div className="space-y-2">
		<div className="grid grid-cols-3 gap-4">
			<div className="space-y-2">
				<Label>Min</Label>
				<Input
					type="number"
					value={field.min ?? ""}
					onChange={(e) =>
						onUpdate({ min: e.target.value ? Number(e.target.value) : null })
					}
					className={error ? "border-red-300" : ""}
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
					className={error ? "border-red-500" : ""}
				/>
			</div>
		</div>
		{error && <p className="text-sm text-red-500">{error}</p>}
	</div>
);
