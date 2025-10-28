import axios from "axios";

type ApiError = {
	message: string;
	errors?: Record<string, string[]>;
};

/**
 * Wrapper reusable untuk semua request API
 */
export async function handleApi<T>(callback: () => Promise<T>) {
	try {
		const res = await callback();
		return { data: res, error: null as ApiError | null };
	} catch (err) {
		let message = "Terjadi kesalahan tidak diketahui";
		let errors: Record<string, string[]> | undefined;

		if (axios.isAxiosError(err)) {
			const backend = err.response?.data;
			message = backend?.message || err.message;
			errors = backend?.errors;
		} else if (err instanceof Error) {
			message = err.message;
		}

		return { data: null as T | null, error: { message, errors } };
	}
}
