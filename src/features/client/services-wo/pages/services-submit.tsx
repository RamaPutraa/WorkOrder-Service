import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	RefreshCw,
	FileText,
	ArrowRight,
	ChevronLeft,
	Clock,
	CheckCircle2,
} from "lucide-react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getAllClientServiceRequestApi } from "../services/public-services";
import { useNavigate } from "react-router-dom";

const ServiceSubmitPage = () => {
	const [requests, setRequests] = useState<PublicServiceRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const getAllClientRequests = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getAllClientServiceRequestApi(),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		setRequests(res?.data ?? []);
	};

	useEffect(() => {
		void getAllClientRequests();
	}, []);

	const getStatusBadge = (status: string) => {
		const statusMap: Record<
			string,
			{ label: string; variant: "default" | "secondary" | "outline"; icon: any }
		> = {
			active: {
				label: "Aktif",
				variant: "default",
				icon: <Clock className="w-3 h-3" />,
			},
			completed: {
				label: "Selesai",
				variant: "secondary",
				icon: <CheckCircle2 className="w-3 h-3" />,
			},
			pending: {
				label: "Menunggu",
				variant: "outline",
				icon: <Clock className="w-3 h-3" />,
			},
		};

		const statusInfo = statusMap[status] || statusMap.pending;

		return (
			<Badge variant={statusInfo.variant} className="gap-1">
				{statusInfo.icon}
				{statusInfo.label}
			</Badge>
		);
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
				<p className="text-muted-foreground">Memuat riwayat permintaan...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center mb-4">{error}</p>
					<Button
						onClick={getAllClientRequests}
						variant="outline"
						className="w-full">
						<RefreshCw className="w-4 h-4 mr-2" />
						Coba Lagi
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-6">
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>
					<div className="flex flex-col space-y-2">
						<h1 className="text-xl font-bold tracking-tight">
							Riwayat Permintaan Layanan
						</h1>
						<p className="text-muted-foreground">
							Total {requests.length} permintaan layanan
						</p>
					</div>
				</div>
				<Button
					onClick={getAllClientRequests}
					variant="outline"
					disabled={loading}>
					<RefreshCw className="size-4 mr-2" />
					Muat Ulang
				</Button>
			</div>

			{/* Empty State */}
			{requests.length === 0 ?
				<Card className="shadow-lg">
					<CardContent className="py-16">
						<div className="text-center">
							<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<p className="text-lg font-medium text-gray-600">
								Belum ada permintaan layanan
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Permintaan layanan Anda akan muncul di sini
							</p>
						</div>
					</CardContent>
				</Card>
			:	/* Cards Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{requests.map((item) => (
						<Card
							key={item?._id}
							className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500/50">
							<CardHeader className="space-y-3">
								<div className="flex items-start justify-between">
									<div className="p-3 bg-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										<FileText className="w-5 h-5 text-white" />
									</div>
									{getStatusBadge(item.status)}
								</div>
								<div className="space-y-1">
									<CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
										{item.service?.title ?? "Tanpa Judul"}
									</CardTitle>
									<CardDescription className="line-clamp-2">
										{item.service?.description ?? "Tidak ada deskripsi"}
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent>
								<Button
									onClick={() =>
										navigate(`/dashboard/client/submissions/${item._id}`)
									}
									className="w-full group/btn bg-blue-600 hover:bg-blue-700 shadow-md">
									<span>Lihat Detail</span>
									<ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			}
		</div>
	);
};

export default ServiceSubmitPage;
