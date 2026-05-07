import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CloudOff, RefreshCw } from "lucide-react";

export default function ServiceUnavailablePage() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center  px-4">
			<div className="w-full max-w-md text-center space-y-6">
				{/* Code */}
				<p className="text-8xl font-bold tracking-tight text-slate-200 select-none">
					503
				</p>

				{/* Icon */}
				<div className="flex justify-center">
					<div className="rounded-2xl bg-slate-100 p-5 text-slate-500">
						<CloudOff className="h-10 w-10" />
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-slate-900">
						Layanan Tidak Tersedia
					</h1>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Layanan sedang dalam pemeliharaan atau mengalami gangguan sementara.
						Kami sedang bekerja untuk memulihkannya. Silakan coba lagi dalam
						beberapa menit.
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
						onClick={() => window.location.reload()}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Coba Lagi
					</Button>
				</div>
			</div>
		</div>
	);
}
