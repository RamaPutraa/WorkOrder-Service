export type FieldType =
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

export type FieldConfig = {
	name: string;
	label: string;
	placeholder?: string;
	type: FieldType;
};
