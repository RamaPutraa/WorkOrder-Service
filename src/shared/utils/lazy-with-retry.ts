import { lazy, type ComponentType } from "react";

/**
 * Wrapper di atas React.lazy() yang otomatis retry ketika chunk gagal di-fetch.
 *
 * Masalah: Setelah deploy baru, file JS chunk lama (misal `page-CnFajoGn.js`)
 * sudah tidak ada di server karena diganti hash baru. User yang belum refresh
 * browser akan gagal saat navigasi ke halaman lazy-loaded.
 *
 * Solusi: Retry import hingga `maxRetries` kali. Jika tetap gagal setelah semua
 * retry, reload halaman agar browser mendapatkan HTML + chunk references terbaru.
 * Menggunakan sessionStorage flag untuk mencegah infinite reload loop.
 */

const RELOAD_FLAG_KEY = "chunk-reload-attempted";

type LazyFactory<T = Record<string, unknown>> = () => Promise<{
	default: ComponentType<T>;
}>;

export function lazyWithRetry<T = Record<string, unknown>>(
	factory: LazyFactory<T>,
	maxRetries = 2,
) {
	return lazy(() => retryImport(factory, maxRetries));
}

async function retryImport<T>(
	factory: LazyFactory<T>,
	maxRetries: number,
): Promise<{ default: ComponentType<T> }> {
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const module = await factory();
			// Berhasil load → reset flag reload
			sessionStorage.removeItem(RELOAD_FLAG_KEY);
			return module;
		} catch (error) {
			const isLastAttempt = attempt === maxRetries;

			if (isLastAttempt) {
				// Semua retry gagal → coba force reload sekali
				if (!sessionStorage.getItem(RELOAD_FLAG_KEY)) {
					sessionStorage.setItem(RELOAD_FLAG_KEY, "true");
					window.location.reload();
					// Return promise yang tidak resolve agar React tidak render apa-apa
					// selama browser melakukan reload
					return new Promise(() => {});
				}

				// Sudah pernah reload tapi tetap gagal → throw error agar
				// ditangkap oleh ErrorBoundary / errorElement
				sessionStorage.removeItem(RELOAD_FLAG_KEY);
				throw error;
			}

			// Tunggu sebentar sebelum retry (exponential backoff)
			await new Promise((resolve) =>
				setTimeout(resolve, 1000 * (attempt + 1)),
			);
		}
	}

	// Fallback — seharusnya tidak pernah sampai sini
	throw new Error("Failed to load module after retries");
}
