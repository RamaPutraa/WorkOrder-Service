import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

export default function UnauthorizedPage() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
			<div className="w-full max-w-md text-center space-y-6">
				{/* Code */}
				<p className="text-8xl font-bold tracking-tight text-slate-200 select-none">
					401
				</p>

				{/* Icon */}
				<div className="flex justify-center">
					<div className="rounded-2xl bg-amber-50 p-5 text-amber-500">
						<LockKeyhole className="h-10 w-10" />
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-slate-900">
						Autentikasi Diperlukan
					</h1>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Anda perlu masuk ke akun terlebih dahulu untuk mengakses halaman
						ini. Silakan login dan coba lagi.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Button
						variant="outline"
						className="w-full sm:w-auto"
						onClick={() => navigate(-1)}>
						Kembali
					</Button>
					<Button
						className="w-full sm:w-auto"
						onClick={() => navigate("/login")}>
						Masuk ke Akun
					</Button>
				</div>
			</div>
		</div>
	);
}
