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
	formType: string;
	fields: Field[];
};

type FormResponse = ApiResponse<{
	forms: Form[];
}>;

type GetFormByIdResponse = ApiResponse<{
	form: Form;
}>;
