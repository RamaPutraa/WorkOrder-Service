import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Format email tidak valid"),
	password: z.string().min(6, "Password minimal 6 karakter"),
});

export const clientRegisterSchema = z
	.object({
		name: z.string().min(2, "Nama minimal 2 karakter"),
		email: z.string().email("Format email tidak valid"),
		password: z.string().min(6, "Password minimal 6 karakter"),
		password_confirmation: z.string().min(6, "Password minimal 6 karakter"),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Konfirmasi password tidak sesuai",
		path: ["password_confirmation"],
	});

export const registerCompanySchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter"),
	email: z.string().email("Format email tidak valid"),
	password: z.string().min(6, "Password minimal 6 karakter"),
	companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
});
