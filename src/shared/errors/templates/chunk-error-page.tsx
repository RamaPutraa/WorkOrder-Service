/**
 * chunk-error-page.tsx
 *
 * Halaman error khusus saat terjadi "Failed to fetch dynamically imported module".
 * Biasanya terjadi setelah deployment baru, dimana chunk JS lama sudah tidak ada.
 */
import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";

export default function ChunkErrorPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4">
			<div className="w-full max-w-md text-center space-y-6">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="rounded-2xl bg-amber-50 p-5 text-amber-500">
						<WifiOff className="h-10 w-10" />
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-slate-900">
						Versi Baru Tersedia
					</h1>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Aplikasi telah diperbarui. Halaman perlu dimuat ulang untuk
						mendapatkan versi terbaru. Klik tombol di bawah untuk
						melanjutkan.
					</p>
				</div>

				{/* Action */}
				<Button
					className="w-full sm:w-auto"
					onClick={() => window.location.reload()}
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Muat Ulang Halaman
				</Button>
			</div>
		</div>
	);
}
