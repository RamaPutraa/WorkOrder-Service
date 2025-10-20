import { z } from "zod";

// Schema untuk opsi select/radio
export const fieldOptionSchema = z.object({
	key: z.string().optional(),
	value: z.string().min(1, "Option value tidak boleh kosong"),
});

// Schema utama untuk tiap field
export const fieldSchema = z.object({
	order: z.number().nullable(),
	label: z.string().min(1, "Label wajib diisi"),
	type: z.enum([
		"text",
		"number",
		"textarea",
		"select",
		"checkbox",
		"radio",
		"date",
	]),
	required: z.boolean(),
	// placeholder bisa null atau tidak ada
	placeholder: z.string().nullable().optional(),
	min: z.number().nullable().optional(),
	max: z.number().nullable().optional(),
	// options TETAP ada (default []), jangan .optional() supaya infer tipenya konsisten
	options: z.array(fieldOptionSchema).default([]),
});

// Validasi tambahan (kondisional)
export const validatedFieldSchema = fieldSchema.superRefine((field, ctx) => {
	if (
		["select", "radio"].includes(field.type) &&
		(!field.options || field.options.length === 0)
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Tipe field select atau radio harus memiliki minimal 1 opsi",
			path: ["options"],
		});
	}

	if (
		field.type === "number" &&
		field.min != null &&
		field.max != null &&
		field.min > field.max
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Nilai min tidak boleh lebih besar dari max",
			path: ["min"],
		});
	}
});

// Schema form lengkap
export const formSchema = z.object({
	title: z.string().min(1, "Title wajib diisi"),
	description: z.string().min(1, "Description wajib diisi"),
	accessType: z.string().min(1, "AccessType wajib diisi"),
	accessibleBy: z
		.array(z.string().min(1))
		.min(1, "AccessibleBy minimal 1 item"),
	allowedPositions: z
		.array(z.string().min(1))
		.min(1, "AllowedPositions minimal 1 item"),
	fields: z.array(validatedFieldSchema).min(1, "Minimal satu field diperlukan"),
});

export type FormSchema = z.infer<typeof formSchema>;
export type FieldSchema = z.infer<typeof validatedFieldSchema>;
