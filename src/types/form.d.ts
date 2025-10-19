type FieldType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "textarea"
	| "single_select"
	| "multi_select"
	| "date"
	| "file";

type FieldConfig = {
	name: Path<T>;
	label: string;
	placeholder?: string;
	type: FieldType;
};
