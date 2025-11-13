type FieldOption = {
	key?: string;
	value: string;
};

type Field = {
	fieldId: string;
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

type FormResponse = ApiResponse<Form[]>;

type GetAllPosition = ApiResponse<Position[]>;

type GetFormByIdResponse = ApiResponse<Form>;
