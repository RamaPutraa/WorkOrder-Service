import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
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
			getAllClientServiceRequestApi()
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		setRequests(res?.data ?? []);
		console.log(res);
	};

	useEffect(() => {
		void getAllClientRequests();
	}, []);

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Daftar Layanan Client</h1>
				<Button
					onClick={getAllClientRequests}
					variant="outline"
					disabled={loading}>
					{loading ? (
						<>
							<Loader2 className="size-4 mr-2 animate-spin" /> Memuat...
						</>
					) : (
						<>
							<RefreshCw className="size-4 mr-2" /> Muat Ulang
						</>
					)}
				</Button>
			</div>

			{/* Loading */}
			{loading && (
				<div className="flex justify-center py-16">
					<Loader2 className="size-6 animate-spin text-muted-foreground" />
				</div>
			)}

			{/* Error */}
			{error && !loading && (
				<p className="text-center text-red-500 font-medium">{error}</p>
			)}

			{/* Empty */}
			{!loading && !error && requests.length === 0 && (
				<p className="text-center text-muted-foreground">
					Tidak ada layanan yang ditemukan.
				</p>
			)}

			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{requests.map((item) => (
					<Card
						key={item?._id}
						className="hover:shadow-md transition-all duration-200">
						<CardHeader>
							<CardTitle>{item.service?.title ?? "Tanpa Judul"}</CardTitle>
							<CardDescription>
								{item.service?.description ?? "Tidak ada deskripsi"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex justify-between items-center mt-4">
								<span
									className={`px-3 py-1 text-xs rounded-full ${
										item.status === "active"
											? "bg-green-100 text-green-700"
											: "bg-gray-200 text-gray-600"
									}`}>
									{item.status}
								</span>
								<Button
									size="sm"
									variant="secondary"
									onClick={() =>
										navigate(`/dashboard/client/submissions/${item._id}`)
									}>
									Lihat Detail
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default ServiceSubmitPage;
