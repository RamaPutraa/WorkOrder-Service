import { Control, UseFormRegister, FieldErrors } from "react-hook-form";

export type FieldType =
	| "text"
	| "number"
	| "checkbox"
	| "radio"
	| "select"
	| "multi-select";
export type AccessType = "public" | "private" | "restricted";

export type FieldOption = {
	key: string; // Disesuaikan
	value: string;
};

// Tipe data yang dikirimkan ke server untuk posisi
export type AllowedPositionRequest = string; // Hanya mengirimkan ID posisi

export type FormField = {
	_id: string;
	order: number | null;
	type: FieldType;
	label: string;
	placeholder: string | null;
	required: boolean;
	min: number | null;
	max: number | null;
	options: FieldOption[] | null;
};

// Root type formulir untuk React Hook Form (berdasarkan CREATE REQUEST BODY)
export type FormStructure = {
	title: string;
	description: string;
	accessType: AccessType;
	accessibleBy: string[];
	allowedPositions: AllowedPositionRequest[]; // Array of IDs yang dikirim ke server
	fields: FormField[];
};

// Tipe Props dasar untuk komponen Field RHF
export interface BaseFieldProps {
	fieldIndex: number;
	control: Control<FormStructure>;
	register: UseFormRegister<FormStructure>;
	errors: FieldErrors<FormField>;
	onRemoveField: () => void;
}
