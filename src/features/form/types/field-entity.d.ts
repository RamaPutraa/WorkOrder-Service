type FieldOption = {
	key: string;
	value: string;
};

type FormField = {
	order: number | null;
	label: string;
	type: string;
	required: boolean;
	placeholder: string | null;
	min: number | null;
	max: number | null;
	options: FieldOption[];
};
