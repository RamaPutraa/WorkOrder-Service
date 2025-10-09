import React from "react";
import type { Field } from "../../types/form";
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
import { Checkbox } from "@/components/ui/checkbox";

import { FieldText } from "./field-text";
import { FieldTextarea } from "./field-textarea";
import { FieldNumber } from "./field-number";
import { FieldDate } from "./field-date";
import { FieldSelect } from "./field-select";
import { FieldCheckbox } from "./field-checkbox";
import { FieldRadio } from "./field-radio";

type Props = {
	index: number;
	field: Field;
	onRemove: () => void;
	onUpdate: (updated: Partial<Field>) => void;
};

export const FieldItem: React.FC<Props> = ({
	index,
	field,
	onRemove,
	onUpdate,
}) => {
	const renderField = () => {
		switch (field.type) {
			case "text":
				return <FieldText field={field} onUpdate={onUpdate} />;
			case "textarea":
				return <FieldTextarea field={field} onUpdate={onUpdate} />;
			case "number":
				return <FieldNumber field={field} onUpdate={onUpdate} />;
			case "date":
				return <FieldDate field={field} onUpdate={onUpdate} />;
			case "select":
				return <FieldSelect field={field} onUpdate={onUpdate} />;
			case "checkbox":
				return <FieldCheckbox field={field} onUpdate={onUpdate} />;
			case "radio":
				return <FieldRadio field={field} onUpdate={onUpdate} />;
			default:
				return null;
		}
	};

	return (
		<div className="border p-4 rounded-md space-y-3">
			<div className="flex justify-between items-center">
				<h4 className="font-semibold">Field {index + 1}</h4>
				<Button
					variant="destructive"
					type="button"
					onClick={onRemove}
					className="text-sm">
					Hapus
				</Button>
			</div>

			{/* Label */}
			<div className="space-y-2">
				<Label>Label</Label>
				<Input
					value={field.label}
					onChange={(e) => onUpdate({ label: e.target.value })}
					placeholder="Nama field"
				/>
			</div>

			{/* Tipe Field */}
			<div className="space-y-2">
				<Label>Tipe Field</Label>
				<Select
					value={field.type}
					onValueChange={(v) => onUpdate({ type: v as Field["type"] })}>
					<SelectTrigger>
						<SelectValue placeholder="Pilih tipe field" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="text">Text</SelectItem>
						<SelectItem value="textarea">Textarea</SelectItem>
						<SelectItem value="number">Number</SelectItem>
						<SelectItem value="date">Date</SelectItem>
						<SelectItem value="select">Select</SelectItem>
						<SelectItem value="checkbox">Checkbox</SelectItem>
						<SelectItem value="radio">Radio</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Dynamic Subfield */}
			{renderField()}

			{/* Required */}
			<div className="flex items-center gap-2 mt-2">
				<Checkbox
					checked={field.required}
					onCheckedChange={(checked) =>
						onUpdate({ required: checked === true })
					}
				/>
				<Label>Wajib diisi</Label>
			</div>
		</div>
	);
};
