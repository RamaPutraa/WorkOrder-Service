import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

export type ErrorStatus = 404 | 403 | 500;

interface ErrorPageProps {
	status?: ErrorStatus;
	message?: string;
}

const getErrorContent = (status: ErrorStatus) => {
	switch (status) {
		case 404:
			return {
				title: "Halaman Tidak Ditemukan",
				message:
					"Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.",
			};
		case 403:
			return {
				title: "Akses Ditolak",
				message: "Anda tidak memiliki izin untuk mengakses halaman ini.",
			};
		default:
			return {
				title: "Terjadi Kesalahan",
				message: "Terjadi kesalahan pada sistem. Silakan coba lagi nanti.",
			};
	}
};

export default function ErrorPage({
	status = 500,
	message: customMessage,
}: ErrorPageProps) {
	const navigate = useNavigate();
	const { title, message } = getErrorContent(status);

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/40">
			<Card className="p-8 max-w-md w-full text-center shadow-lg rounded-2xl">
				<div className="flex flex-col items-center space-y-4">
					<AlertTriangle className="h-12 w-12 text-red-500" />
					<h1 className="text-2xl font-bold">{title}</h1>
					<p className="text-muted-foreground">{customMessage ?? message}</p>

					<div className="flex space-x-3 mt-6">
						<Button onClick={() => navigate(-1)} variant="outline">
							Kembali
						</Button>
						<Button onClick={() => window.location.reload()}>
							<RefreshCw className="h-4 w-4 mr-2" />
							Muat Ulang
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
