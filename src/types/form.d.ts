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

type FieldConfig = {
	name: Path<T>;
	label: string;
	placeholder?: string;
	type: FieldType;
};
