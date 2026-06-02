import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FieldOption } from "../field-type/field-option";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { FieldText } from "../field-type/field-text";
import { FieldNumber } from "../field-type/field-number";
import { FieldDate } from "../field-type/field-date";
import FieldImage from "../field-type/field-image";

type Props = {
	field: Field;
	onRemove: () => void;
	onUpdate: (updated: Partial<Field>) => void;
	error?: string;
};

export const FieldItem: React.FC<Props> = ({
	field,
	onRemove,
	onUpdate,
	error,
}) => {
	const renderField = () => {
		switch (field.type) {
			case "text":
			case "textarea":
				return <FieldText field={field} onUpdate={onUpdate} error={error} />;
			case "number":
				return <FieldNumber field={field} onUpdate={onUpdate} error={error} />;
			case "multi_select":
			case "single_select":
				return <FieldOption field={field} onUpdate={onUpdate} error={error} />;
			case "date":
				return <FieldDate field={field} onUpdate={onUpdate} error={error} />;
			case "image":
				return <FieldImage field={field} onUpdate={onUpdate} error={error} />;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-4">
			{/* Question label + type selector */}
			<div className="flex flex-col sm:flex-row gap-3">
				{/* Label input — takes most space */}
				<div className="flex-1 min-w-0">
					<Input
						className={`h-10 rounded-lg text-sm font-medium ${error ?
							"border-red-400 focus-visible:ring-red-300"
							: "focus-visible:ring-primary/30 focus-visible:border-primary"
							}`}
						value={field.label}
						onChange={(e) => onUpdate({ label: e.target.value })}
						placeholder="Tulis pertanyaan di sini..."
					/>
				</div>

				{/* Type selector — fixed width */}
				<div className="w-full sm:w-44 shrink-0">
					<Select
						value={field.type}
						onValueChange={(v) => {
							const newType = v as Field["type"];
							const updates: Partial<Field> = { type: newType };

							// Reset options if not choice/select types
							if (newType !== "single_select" && newType !== "multi_select") {
								updates.options = [];
							}

							// Reset min/max if not number
							if (newType !== "number") {
								updates.min = null;
								updates.max = null;
							}

							// Reset placeholder if not text/textarea/date
							if (newType !== "text" && newType !== "textarea" && newType !== "date") {
								updates.placeholder = null;
							}

							onUpdate(updates);
						}}>
						<SelectTrigger className="h-10 rounded-lg w-full text-sm border-slate-200">
							<SelectValue placeholder="Tipe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="text">Jawaban singkat</SelectItem>
							<SelectItem value="textarea">Paragraf</SelectItem>
							<SelectItem value="number">Angka</SelectItem>
							<SelectItem value="date">Tanggal</SelectItem>
							<SelectItem value="multi_select">Pilihan Ganda</SelectItem>
							<SelectItem value="single_select">Pilihan Tunggal</SelectItem>
							<SelectItem value="image">Gambar</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Field-type specific sub-fields */}
			<div>{renderField()}</div>

			{/* Footer: required toggle + delete */}
			<div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
				<div className="flex items-center gap-2">
					<Switch
						id={`required-${field.order}`}
						checked={field.required}
						onCheckedChange={(checked) =>
							onUpdate({ required: checked === true })
						}
					/>
					<Label
						htmlFor={`required-${field.order}`}
						className="text-xs text-muted-foreground cursor-pointer select-none">
						Wajib diisi
					</Label>
				</div>
				<Button
					variant="ghost"
					size="sm"
					type="button"
					onClick={onRemove}
					className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
					<Trash2 size={15} />
				</Button>
			</div>
		</div>
	);
};
