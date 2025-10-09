import React from "react";
import { Button } from "@/components/ui/button";
import { FieldItem } from "./field-types/field-item";
import type { Field } from "../types/form";

type Props = {
	fields: Field[];
	onAdd: () => void;
	onRemove: (index: number) => void;
	onUpdate: (index: number, updated: Partial<Field>) => void;
};

export const DynamicFields: React.FC<Props> = ({
	fields,
	onAdd,
	onRemove,
	onUpdate,
}) => {
	return (
		<div className="space-y-4">
			<h3 className="font-semibold text-lg">Dynamic Fields</h3>
			{fields.map((field, index) => (
				<FieldItem
					key={index}
					index={index}
					field={field}
					onRemove={() => onRemove(index)}
					onUpdate={(updated) => onUpdate(index, updated)}
				/>
			))}
			<Button type="button" variant="secondary" onClick={onAdd}>
				+ Tambah Field
			</Button>
		</div>
	);
};
