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
