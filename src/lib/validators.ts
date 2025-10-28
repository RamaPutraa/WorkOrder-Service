// src/lib/validators.ts
export type ValidatorFn<T> = (value: T) => string | null;

/**
 * required generic — works for string, array, object, null, undefined
 */
export const required =
	<T = unknown>(fieldName = "Field"): ValidatorFn<T> =>
	(value) => {
		if (value === null || value === undefined)
			return `${fieldName} wajib diisi`;
		if (typeof value === "string" && !value.trim())
			return `${fieldName} wajib diisi`;
		if (Array.isArray(value) && value.length === 0)
			return `${fieldName} wajib diisi`;
		return null;
	};

export const minLength =
	(min: number, fieldName = "Field"): ValidatorFn<string> =>
	(value) =>
		value && value.length < min ? `${fieldName} minimal ${min} karakter` : null;

export const maxLength =
	(max: number, fieldName = "Field"): ValidatorFn<string> =>
	(value) =>
		value && value.length > max
			? `${fieldName} maksimal ${max} karakter`
			: null;

export const minFields =
	<T = unknown>(min: number, message?: string): ValidatorFn<T[]> =>
	(value) => {
		if (!Array.isArray(value)) return "Format data tidak valid";
		if (value.length < min) return message || `Minimal harus ada ${min} item`;
		return null;
	};

export const maxFields =
	<T = unknown>(max: number, message?: string): ValidatorFn<T[]> =>
	(value) => {
		if (!Array.isArray(value)) return "Format data tidak valid";
		if (value.length > max)
			return message || `Maksimal hanya boleh ${max} item`;
		return null;
	};

export const pattern =
	(regex: RegExp, message = "Format tidak valid"): ValidatorFn<string> =>
	(value) => {
		if (!value) return null;
		return !regex.test(value) ? message : null;
	};
