import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldText: React.FC<Props> = ({ field, onUpdate, error }) => (
	<div className="space-y-1.5">
		<Label className={`text-xs font-medium ${error ? "text-red-500" : "text-muted-foreground"}`}>
			Placeholder <span className="font-normal opacity-60">(Opsional)</span>
		</Label>
		<Input
			value={field.placeholder ?? ""}
			onChange={(e) => onUpdate({ placeholder: e.target.value })}
			placeholder="Contoh: Masukkan jawaban di sini..."
			className={`h-9 rounded-lg text-sm ${
				error ?
					"border-red-400 focus-visible:ring-red-300"
				:	"focus-visible:ring-primary/30"
			}`}
		/>
		{error && (
			<p className="text-xs text-red-500 flex items-center gap-1">
				<AlertCircle className="w-3 h-3 shrink-0" />
				{error}
			</p>
		)}
	</div>
);
