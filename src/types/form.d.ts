import type { FieldValues, Path } from "react-hook-form";

type FieldType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "textarea"
	| "select"
	| "checkbox"
	| "radio"
	| "date"
	| "file";

type FieldConfig<T extends FieldValues = FieldValues> = {
	name: Path<T>;
	label: string;
	placeholder?: string;
	type: FieldType;
};
