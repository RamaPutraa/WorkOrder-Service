/**
 * form-field-validation.ts
 *
 * Validasi inline untuk setiap tipe field di FormFieldViewer.
 * Dipisahkan agar file komponen tidak terlalu panjang.
 *
 * Validasi hanya berjalan saat field sudah "touched" (user pernah interaksi)
 * dan mode readOnly = false.
 */

import type { AnswerValue } from "@/shared/molecules/form-field-viewer";

// ── Helper ────────────────────────────────────────────────────────────────────

function isEmpty(value: AnswerValue): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === "string" && value.trim() === "") return true;
	if (Array.isArray(value) && value.length === 0) return true;
	return false;
}

// ── Validator per tipe field ──────────────────────────────────────────────────

function validateText(field: Field, value: AnswerValue): string | null {
	if (field.required && isEmpty(value)) {
		return "Field ini wajib diisi";
	}
	return null;
}

function validateTextarea(field: Field, value: AnswerValue): string | null {
	if (field.required && isEmpty(value)) {
		return "Field ini wajib diisi";
	}
	return null;
}

function validateNumber(field: Field, value: AnswerValue): string | null {
	if (field.required && isEmpty(value)) {
		return "Field ini wajib diisi";
	}

	if (!isEmpty(value)) {
		const num = Number(value);

		if (isNaN(num)) {
			return "Masukkan angka yang valid";
		}
		if (field.min != null && num < field.min) {
			return `Nilai minimal adalah ${field.min}`;
		}
		if (field.max != null && num > field.max) {
			return `Nilai maksimal adalah ${field.max}`;
		}
	}

	return null;
}

function validateDate(field: Field, value: AnswerValue): string | null {
	if (field.required && isEmpty(value)) {
		return "Tanggal wajib dipilih";
	}
	return null;
}

function validateSingleSelect(
	field: Field,
	value: AnswerValue,
): string | null {
	if (field.required && isEmpty(value)) {
		return "Pilih salah satu opsi";
	}
	return null;
}

function validateMultiSelect(field: Field, value: AnswerValue): string | null {
	if (field.required) {
		// Normalisasi value ke array untuk pengecekan
		let arr: unknown[] = [];
		if (Array.isArray(value)) {
			arr = value;
		} else if (value != null && value !== "") {
			if (
				typeof value === "string" &&
				value.startsWith("[") &&
				value.endsWith("]")
			) {
				try {
					arr = JSON.parse(value);
				} catch {
					arr = [value];
				}
			} else if (typeof value === "string" && value.includes(",")) {
				arr = value.split(",").map((s) => s.trim());
			} else {
				arr = [String(value)];
			}
		}

		if (arr.length === 0) {
			return "Pilih minimal satu opsi";
		}
	}
	return null;
}

function validateImage(field: Field, value: AnswerValue): string | null {
	if (field.required && isEmpty(value) && !(value instanceof File)) {
		return "Gambar wajib diunggah";
	}
	return null;
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validasi satu field berdasarkan tipe dan konfigurasinya.
 * Mengembalikan pesan error (string) jika tidak valid, atau null jika valid.
 */
export function validateField(field: Field, value: AnswerValue): string | null {
	switch (field.type) {
		case "text":
			return validateText(field, value);
		case "textarea":
			return validateTextarea(field, value);
		case "number":
			return validateNumber(field, value);
		case "date":
			return validateDate(field, value);
		case "single_select":
			return validateSingleSelect(field, value);
		case "multi_select":
			return validateMultiSelect(field, value);
		case "image":
			return validateImage(field, value);
		default:
			return null;
	}
}
