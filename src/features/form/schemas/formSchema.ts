// import z from "zod";

// export const fieldSchema = z.object({
// 	name: z.string().min(1, { message: "Nama harus diisi" }),
// 	label: z.string().min(1, { message: "Label harus diisi" }),
// 	placeholder: z.string().optional(),
// 	type: z.enum([
// 		"text",
// 		"email",
// 		"password",
// 		"number",
// 		"textarea",
// 		"select",
// 		"checkbox",
// 		"radio",
// 		"date",
// 		"file",
// 	]),
// });

// export const formSchema = z.object({
// 	title: z.string().min(2, "Judul minimal 2 karakter"),
// 	description: z.string().min(5, "Deskripsi minimal 5 karakter"),
// 	accessType: z.enum(["public", "private"]),
// 	accessibleBy: z.array(z.string()).default([]),
// 	allowedPositions: z.array(z.string()).default([]),
// 	fields: z.array(fieldSchema).min(1, "Minimal 1 field wajib ditambahkan"),
// });

import { z } from "zod";
export const fieldOptionSchema = z.object({
	key: z.string(),
	value: z.string().min(1, "Option value tidak boleh kosong"),
});
export const fieldSchema = z.object({
	order: z.number().nullable(),
	label: z.string().min(1, "Label wajib diisi"),
	type: z.enum(["text", "number", "checkbox", "single-select"]),
	required: z.boolean(),
	placeholder: z.string().nullable(),
	min: z.number().nullable(),
	max: z.number().nullable(),
	options: z.array(fieldOptionSchema),
});
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
	fields: z.array(fieldSchema).min(1, "Minimal satu field diperlukan"),
});
export type FormSchema = z.infer<typeof formSchema>;
