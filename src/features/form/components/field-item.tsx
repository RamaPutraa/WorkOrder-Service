import React from "react";
import { Controller } from "react-hook-form";

import type {
	Control,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";
import type { FormSchema } from "../schemas/formSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
type Props = {
	index: number;
	control: Control<FormSchema>;
	onRemove: UseFieldArrayRemove;
	update: UseFieldArrayUpdate<FormSchema>;
};
export const FieldItem: React.FC<Props> = ({ index, control, onRemove }) => {
	return (
		<div className="border rounded-lg p-4 space-y-3 bg-muted/30">
			<div className="flex justify-between items-center">
				<Label className="font-semibold">Field #{index + 1}</Label>
				<Button
					type="button"
					variant="destructive"
					size="sm"
					onClick={() => onRemove(index)}>
					Hapus
				</Button>
			</div>
			<Controller
				control={control}
				name={`fields.${index}.label`}
				render={({ field, fieldState }) => (
					<div>
						<Input placeholder="Label" {...field} />
						{fieldState.error && (
							<p className="text-sm text-red-500 mt-1">
								{fieldState.error.message}
							</p>
						)}
					</div>
				)}
			/>
			<Controller
				control={control}
				name={`fields.${index}.type`}
				render={({ field }) => (
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih tipe field" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="text">Text</SelectItem>
							<SelectItem value="number">Number</SelectItem>
							<SelectItem value="checkbox">Checkbox</SelectItem>
							<SelectItem value="single-select">Single Select</SelectItem>
						</SelectContent>
					</Select>
				)}
			/>
			<Controller
				control={control}
				name={`fields.${index}.required`}
				render={({ field }) => (
					<div className="flex items-center gap-2">
						<Checkbox
							checked={field.value}
							onCheckedChange={(val) => field.onChange(!!val)}
						/>
						<Label>Required</Label>
					</div>
				)}
			/>
			<Separator className="mt-3" />
		</div>
	);
};
