import React from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import type { Field } from "../../types/form";

type Props = {
	field: Field;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldDate: React.FC<Props> = ({ field, onUpdate }) => (
	<div className="space-y-2">
		<Label>Format Tanggal</Label>
		<Select
			value={field.format ?? "yyyy-MM-dd"}
			onValueChange={(v) => onUpdate({ format: v })}>
			<SelectTrigger>
				<SelectValue placeholder="Pilih format tanggal" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
				<SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
				<SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
			</SelectContent>
		</Select>
	</div>
);
