import { useState, useEffect } from "react";
import type { ValidatorFn } from "@/lib/validators";

export function useValidation<T extends Record<string, unknown>>(
	initialValues: T,
	validators: Partial<Record<keyof T, ValidatorFn<T[keyof T]>[]>>
) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	const validateField = <K extends keyof T>(
		field: K,
		value: T[K]
	): string | null => {
		const fieldValidators = validators[field];
		if (!fieldValidators) return null;

		for (const validator of fieldValidators) {
			const error = validator(value);
			if (error) return error;
		}
		return null;
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof T, string>> = {};
		for (const key in validators) {
			const fieldKey = key as keyof T;
			const error = validateField(fieldKey, values[fieldKey]);
			if (error) newErrors[fieldKey] = error;
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const setFormData = (updater: T | ((prev: T) => T)) => {
		setValues((prev) =>
			typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater
		);
	};

	useEffect(() => {
		if (Object.keys(errors).length === 0) return;

		const updatedErrors: Partial<Record<keyof T, string>> = { ...errors };
		let hasChange = false;

		for (const key in validators) {
			const fieldKey = key as keyof T;
			const currentError = errors[fieldKey];
			if (currentError) {
				const newError = validateField(fieldKey, values[fieldKey]);
				if (!newError) {
					delete updatedErrors[fieldKey];
					hasChange = true;
				}
			}
		}

		if (hasChange) setErrors(updatedErrors);
	}, [values]);

	const clearAllErrors = () => setErrors({});

	return {
		formData: values,
		setFormData,
		setFieldValue,
		errors,
		validateForm,
		clearAllErrors,
	};
}
