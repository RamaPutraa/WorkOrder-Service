import { z } from "zod";

export const membercodeSchema = z.object({
	file: z.instanceof(File, { message: "File data pelanggan (CSV) wajib diunggah" }),
});
