import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldDate: React.FC<Props> = ({ field, onUpdate, error }) => (
	<div className="space-y-4">
		<div className="space-y-1.5">
			<Label
				className={`text-xs font-medium ${error ? "text-red-500" : "text-muted-foreground"}`}>
				Placeholder
			</Label>
			<Input
				value={field.placeholder ?? ""}
				onChange={(e) => onUpdate({ placeholder: e.target.value })}
				placeholder="Contoh: Pilih tanggal..."
				className={`h-9 rounded-lg text-sm ${
					error ?
						"border-red-400 focus-visible:ring-red-300"
					:	"focus-visible:ring-primary/30"
				}`}
			/>
		</div>

		<div className="space-y-1.5">
			<Button
				variant="outline"
				disabled
				className="w-full sm:w-64 justify-start text-left font-normal h-9 rounded-lg border-slate-200 bg-slate-50/50">
				<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
				<span className="text-muted-foreground">
					{field.placeholder || "Pilih tanggal"}
				</span>
			</Button>
		</div>

		{error && (
			<p className="text-xs text-red-500 flex items-center gap-1">
				<AlertCircle className="w-3 h-3 shrink-0" />
				{error}
			</p>
		)}
	</div>
);
