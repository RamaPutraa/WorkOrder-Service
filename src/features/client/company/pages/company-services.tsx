import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";
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
				<p className="text-muted-foreground">Memuat layanan...</p>
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<p className="text-red-500">{error}</p>
				<Button variant="outline" className="mt-3" onClick={() => navigate(-1)}>
					Kembali
				</Button>
			</div>
		);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between pb-4">
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(-1)}
						className="flex items-center gap-1">
						<ArrowLeft className="w-4 h-4" /> Kembali
					</Button>
					<h1 className="text-xl font-semibold">Daftar Layanan Perusahaan</h1>
				</div>
			</div>

			{/* Card Layanan */}
			{services.length === 0 ? (
				<p className="text-muted-foreground text-center py-8">
					Tidak ada layanan tersedia untuk perusahaan ini.
				</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{services.map((service) => (
						<Card
							key={service._id}
							className="border shadow-sm hover:shadow-md transition-all duration-200">
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-base font-medium">
									{service.title}
								</CardTitle>
								<Wrench className="w-5 h-5 text-primary" />
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									{service.description || "Tidak ada deskripsi layanan."}
								</p>
								<p className="text-xs text-muted-foreground mt-2">
									{service.accessType
										? `Kategori: ${service.accessType}`
										: "Tanpa kategori"}
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-3 w-full"
									onClick={() =>
										navigate(
											`/dashboard/client/company/services/${service._id}/intake-forms`
										)
									}>
									Detail
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default ClientCompanyServices;
