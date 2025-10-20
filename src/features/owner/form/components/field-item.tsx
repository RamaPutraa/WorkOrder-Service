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

// Sub-komponen spesifik per tipe
import { FieldOption } from "./field-type/field-option";

import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { FieldText } from "./field-type/field-text";
import { FieldNumber } from "./field-type/field-number";

type Props = {
	field: Field;
	onRemove: () => void;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldItem: React.FC<Props> = ({ field, onRemove, onUpdate }) => {
	const renderField = () => {
		switch (field.type) {
			case "text":
				return <FieldText field={field} onUpdate={onUpdate} />;
			case "textarea":
				return <FieldText field={field} onUpdate={onUpdate} />;
			case "number":
				return <FieldNumber field={field} onUpdate={onUpdate} />;
			case "date":
				return <FieldOption field={field} onUpdate={onUpdate} />;
			case "multi_select":
				return <FieldOption field={field} onUpdate={onUpdate} />;
			case "single_select":
				return <FieldOption field={field} onUpdate={onUpdate} />;
			default:
				return null;
		}
	};

	return (
		<>
			{/* Header */}
			<div className="grid items-center grid-cols-5 gap-5">
				{/* Label input */}
				<div className="col-span-4">
					<Input
						className="border-0 border-b-2 shadow-none text-lg py-6 focus-visible:ring-0 focus-visible:border-primary"
						value={field.label}
						onChange={(e) => onUpdate({ label: e.target.value })}
						placeholder="Pertanyaan"
					/>
				</div>
				{/* Field type select */}
				<div className="">
					<Select
						value={field.type}
						onValueChange={(v) => onUpdate({ type: v as Field["type"] })}>
						<SelectTrigger className="w-full py-6 border-gray-300">
							<SelectValue placeholder="Tipe" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="text">Jawaban singkat</SelectItem>
							<SelectItem value="textarea">Paragraf</SelectItem>
							<SelectItem value="number">Angka</SelectItem>
							<SelectItem value="date">Tanggal</SelectItem>
							<SelectItem value="multi_select">Pilihan Ganda</SelectItem>
							<SelectItem value="single_select">Pilihan Tunggal</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mt-7">{renderField()}</div>

			{/* Footer actions ala Google Form */}
			<div className="border-t-1 flex items-center justify-end mt-20 pt-5 space-x-2">
				{/* Toggle Wajib diisi */}
				<div className="flex items-center gap-2">
					<Label className="text-sm text-muted-foreground">Wajib diisi</Label>
					<Switch
						checked={field.required}
						onCheckedChange={(checked) =>
							onUpdate({ required: checked === true })
						}
					/>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={onRemove}
					className="text-gray-500 hover:text-red-500">
					<Trash2 size={16} />
				</Button>
			</div>
		</>
	);
};
