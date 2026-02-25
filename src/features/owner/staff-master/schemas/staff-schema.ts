import { z } from "zod";

export const inviteSingleSchema = z.object({
	email: z.string().email("Format email tidak valid"),
	role: z.string().min(1, "Pilih role terlebih dahulu"),
	positionId: z.string().min(1, "Pilih posisi terlebih dahulu"),
});

export const inviteEmployeeSchema = z.object({
	invites: z
		.array(inviteSingleSchema)
		.min(1, "Minimal satu pegawai harus diundang"),
});

export type InviteSingleFormValues = z.infer<typeof inviteSingleSchema>;
export type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeSchema>;
