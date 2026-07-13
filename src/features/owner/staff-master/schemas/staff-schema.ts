import { z } from "zod";

export const inviteSingleSchema = z
	.object({
		email: z.string().email("Format email tidak valid"),
		role: z.string().min(1, "Pilih role terlebih dahulu"),
		positionId: z.string().optional(),
	})
	.superRefine((val, ctx) => {
		if (
			val.role === "staff_company" &&
			(!val.positionId || val.positionId.trim() === "")
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Pilih posisi terlebih dahulu",
				path: ["positionId"],
			});
		}
	});

export const inviteEmployeeSchema = z.object({
	invites: z
		.array(inviteSingleSchema)
		.min(1, "Minimal satu pegawai harus diundang"),
});

export type InviteSingleFormValues = z.infer<typeof inviteSingleSchema>;
export type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeSchema>;

// ─── Invitation Code Schema ───────────────────────────────────────────────

export const staffInvitationCodeSchema = z
	.object({
		role: z.enum(["staff_company", "manager_company"]),
		positionId: z.string().optional(),
		code: z
			.string()
			.regex(/^[A-Z0-9_-]*$/i, "Kode hanya boleh huruf, angka, -, _")
			.min(4, "Minimal 4 karakter")
			.max(32, "Maksimal 32 karakter")
			.optional()
			.or(z.literal("")),
		maxUses: z
			.number()
			.int("Harus bilangan bulat")
			.positive("Harus lebih dari 0")
			.optional(),
		expiresInDays: z.number().int().positive().optional(),
	})
	.superRefine((val, ctx) => {
		if (
			val.role === "staff_company" &&
			(!val.positionId || val.positionId.trim() === "")
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Pilih departemen/posisi terlebih dahulu",
				path: ["positionId"],
			});
		}
	});


export type StaffInvitationCodeFormValues = z.infer<
	typeof staffInvitationCodeSchema
>;

