export type FieldOption = { key: string; value: string };
export type Field = {
	order: number | null;
	label: string;
	type: FieldType;
	required: boolean;
	placeholder: string | null;
	min: number | null;
	max: number | null;
	options: FieldOption[];
};
export type FormPayload = {
	title: string;
	description: string;
	accessType: string;
	accessibleBy: string[];
	allowedPositions: string[];
	fields: Field[];
};
