import { z } from "zod";

export const claimMembershipSchema = z.object({
	code: z
		.string()
		.min(1, "Kode token tidak boleh kosong")
		.trim(),
});

export type ClaimMembershipFormValues = z.infer<typeof claimMembershipSchema>;
