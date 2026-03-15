import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldNumber: React.FC<Props> = ({ field, onUpdate, error }) => (
	<div className="space-y-1.5">
		<div className="grid grid-cols-2 gap-3 max-w-xs">
			<div className="space-y-1">
				<Label className="text-xs font-medium text-muted-foreground">
					Min
				</Label>
				<Input
					type="number"
					value={field.min ?? ""}
					onChange={(e) =>
						onUpdate({ min: e.target.value ? Number(e.target.value) : null })
					}
					className={`h-9 rounded-lg text-sm ${error ? "border-red-400" : ""}`}
				/>
			</div>
			<div className="space-y-1">
				<Label className="text-xs font-medium text-muted-foreground">
					Max
				</Label>
				<Input
					type="number"
					value={field.max ?? ""}
					onChange={(e) =>
						onUpdate({ max: e.target.value ? Number(e.target.value) : null })
					}
					className={`h-9 rounded-lg text-sm ${error ? "border-red-400" : ""}`}
				/>
			</div>
		</div>
		{error && (
			<p className="text-xs text-red-500 flex items-center gap-1">
				<AlertCircle className="w-3 h-3 shrink-0" />
				{error}
			</p>
		)}
	</div>
);
