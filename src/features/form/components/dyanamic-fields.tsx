import React from "react";
import { Button } from "@/components/ui/button";
import { FieldItem } from "./field-item";
import type {
	Control,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	FieldArrayWithId,
} from "react-hook-form";
import type { FormSchema } from "../schemas/formSchema";
type Props = {
	fields: FieldArrayWithId<FormSchema, "fields", "id">[];
	append: UseFieldArrayAppend<FormSchema>;
	remove: UseFieldArrayRemove;
	update: UseFieldArrayUpdate<FormSchema>;
	control: Control<FormSchema>;
};

export const DynamicFields: React.FC<Props> = ({
	fields,
	append,
	remove,
	update,
	control,
}) => {
	const handleAddField = () => {
		append({
			order: null,
			label: "",
			type: "text",
			required: false,
			placeholder: "",
			min: null,
			max: null,
			options: [],
		});
	};
	return (
		<div className="space-y-4">
			<h3 className="font-semibold text-lg">Dynamic Fields</h3>
			{fields.map((field, index) => (
				<FieldItem
					key={field.id}
					index={index}
					control={control}
					onRemove={remove}
					update={update}
				/>
			))}
			<Button type="button" variant="secondary" onClick={handleAddField}>
				+ Tambah Field
			</Button>
		</div>
	);
};
