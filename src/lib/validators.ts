export type ValidatorFn<T> = (value: T) => string | null;

export const required =
	(fieldName = "Field"): ValidatorFn<string> =>
	(value) =>
		!value?.trim() ? `${fieldName} wajib diisi` : null;

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
	(min: number, message?: string): ValidatorFn<unknown[]> =>
	(value) => {
		if (!Array.isArray(value)) return "Format data tidak valid";
		if (value.length < min) {
			return message || `Minimal harus ada ${min} field`;
		}
		return null;
	};

export const maxFields =
	(max: number, message?: string): ValidatorFn<unknown[]> =>
	(value) => {
		if (!Array.isArray(value)) return "Format data tidak valid";
		if (value.length > max) {
			return message || `Maksimal hanya boleh ${max} field`;
		}
		return null;
	};

export const pattern =
	(regex: RegExp, message = "Format tidak valid"): ValidatorFn<string> =>
	(value) => {
		if (!value) return null;
		return !regex.test(value) ? message : null;
	};
