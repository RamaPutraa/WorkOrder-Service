type FieldType =
	| "text"
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

type FieldData = {
	order: number;
	value: string | number | string[] | File | null;
};
