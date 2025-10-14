type FieldOption = {
	key?: string;
	value: string;
};

type Field = {
	order: number | null;
	label: string;
	type: FieldType;
	required: boolean;
	placeholder?: string | null;
	min?: number | null;
	max?: number | null;
	options?: FieldOption[];
};

type CreateFormRequest = {
	title: string;
	description: string;
	accessType: string;
	accessibleBy: string[];
	allowedPositions: { _id: string; name: string }[];
	fields: Field[];
};

type FormResponse = ApiResponse<{
	forms: Form[];
}>;
