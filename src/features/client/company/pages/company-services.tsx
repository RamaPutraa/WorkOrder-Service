import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Wrench, ArrowRight, Loader2 } from "lucide-react";
import useClientCompany from "../hooks/client-company-services";

const ClientCompanyServices = () => {
	const { fetchCompanyServices, services, loading, error } = useClientCompany();
	const navigate = useNavigate();

	useEffect(() => {
		void fetchCompanyServices();
	}, []);

	if (loading)
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
				<p className="text-muted-foreground">Memuat layanan...</p>
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center">{error}</p>
					<Button
						variant="outline"
						className="mt-4 w-full"
						onClick={() => navigate(-1)}>
						Kembali
					</Button>
				</div>
			</div>
		);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center space-x-6">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Layanan Perusahaan
					</h1>
					<p className="text-muted-foreground">
						Pilih layanan yang Anda butuhkan - Total {services.length} layanan
						tersedia
					</p>
				</div>
			</div>

			{/* Services Grid */}
			{services.length === 0 ?
				<Card className="shadow-lg">
					<CardContent className="py-16">
						<div className="text-center">
							<Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
							<p className="text-lg font-medium text-gray-600">
								Tidak ada layanan tersedia
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Perusahaan ini belum memiliki layanan yang dapat dipesan
							</p>
						</div>
					</CardContent>
				</Card>
			:	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map((service) => (
						<Card
							key={service._id}
							className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500/50 overflow-hidden">
							<CardHeader className="space-y-3">
								<div className="flex items-start justify-between">
									<div className="p-3 bg-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										<Wrench className="w-4 h-4 text-white" />
									</div>
									{service.accessType && (
										<Badge variant="secondary" className="text-xs">
											{service.accessType}
										</Badge>
									)}
								</div>
								<div className="space-y-1">
									<p className="text-md font-bold group-hover:text-blue-600 transition-colors">
										{service.title}
									</p>
									<p className="text-sm text-muted-foreground line-clamp-1">
										{service.description || "Tidak ada deskripsi layanan."}
									</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button
									onClick={() =>
										navigate(
											`/dashboard/client/company/services/${service._id}/intake-forms`,
										)
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

export default ClientCompanyServices;
