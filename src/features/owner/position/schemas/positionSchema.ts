import z from "zod";

export const positionSchema = z.object({
	name: z.string().min(1, "Nama posisi wajib diisi"),
});
