/**
 * route-error-boundary.tsx
 *
 * Error boundary khusus untuk digunakan sebagai `errorElement` di React Router.
 * Menggunakan `useRouteError` untuk mendapatkan error, lalu memutuskan apakah
 * menampilkan ChunkErrorPage (jika chunk/module gagal di-load) atau ErrorPage
 * (untuk error umum lainnya).
 *
 * Ini menggantikan penggunaan langsung `<ErrorPage />` di errorElement,
 * sehingga chunk load error (yang sering terjadi setelah deploy baru)
 * mendapatkan UX yang lebih baik.
 */
import { useRouteError } from "react-router-dom";
import ChunkErrorPage from "../templates/chunk-error-page";
import ErrorPage, { type ErrorStatus } from "../templates/error-page";

/**
 * Mengecek apakah error disebabkan oleh chunk/module yang gagal di-load.
 * Biasanya terjadi setelah deployment baru dimana hash file JS berubah.
 */
function isChunkLoadError(error: unknown): boolean {
	if (error instanceof Error) {
		return (
			error.message.includes("Failed to fetch dynamically imported module") ||
			error.message.includes("error loading dynamically imported module") ||
			error.message.includes("Loading chunk") ||
			error.message.includes("Loading CSS chunk") ||
			error.name === "ChunkLoadError"
		);
	}
	return false;
}

export default function RouteErrorBoundary() {
	const error = useRouteError();

	// Chunk/module load error → tampilkan halaman "Versi Baru Tersedia"
	if (isChunkLoadError(error)) {
		return <ChunkErrorPage />;
	}

	// Error lainnya → tampilkan halaman error berdasarkan status code
	let status: ErrorStatus = 500;

	if (error instanceof Response) {
		status = (error.status as ErrorStatus) || 500;
	}

	return <ErrorPage status={status} />;
}
