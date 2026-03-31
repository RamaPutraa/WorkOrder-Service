import { z } from "zod";

export const membercodeSchema = z.object({
	prefix: z
		.string()
		.min(1, "Prefix wajib diisi")
		.max(10, "Prefix maksimal 10 karakter")
		.regex(/^[A-Za-z0-9]+$/, "Prefix hanya boleh berisi huruf dan angka")
		.transform((val) => val.toUpperCase()),
	amount: z.coerce
		.number()
		.min(1, "Min. jumlah kode adalah 1")
		.max(100, "Maks. jumlah kode adalah 100"),
});
