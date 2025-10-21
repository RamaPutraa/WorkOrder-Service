// hooks/useValidation.ts
import { useState } from "react";
import { type ValidatorFn } from "@/lib/validators";

type ValidationSchema<T> = {
	[K in keyof T]?: ValidatorFn<T[K]>[];
};

type ValidationErrors<T> = {
	[K in keyof T]?: string;
};

export function useValidation<T extends Record<string, unknown>>(
	initialData: T,
	schema: ValidationSchema<T>
) {
	const [formData, setFormData] = useState<T>(initialData);
	const [errors, setErrors] = useState<ValidationErrors<T>>({});

	const validateField = (name: keyof T, value: T[keyof T]): string | null => {
		const fieldValidators = schema[name];
		if (!fieldValidators) return null;

		for (const validator of fieldValidators) {
			const errorMessage = validator(value);
			if (errorMessage) return errorMessage;
		}
		return null;
	};

	const validateForm = (): boolean => {
		const newErrors = {} as ValidationErrors<T>;
		(Object.keys(schema) as (keyof T)[]).forEach((key) => {
			const error = validateField(key, formData[key]);
			if (error) newErrors[key] = error;
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateAndSetField = (name: keyof T, value: T[keyof T]) => {
		setFormData((prev) => ({ ...prev, [name]: value }));

		const errorMessage = validateField(name, value);
		setErrors((prev) => {
			const updated = { ...prev };
			if (errorMessage) updated[name] = errorMessage;
			else delete updated[name];
			return updated;
		});
	};

	return {
		formData,
		setFormData,
		errors,
		setErrors,
		validateForm,
		validateField,
		validateAndSetField,
	};
}
