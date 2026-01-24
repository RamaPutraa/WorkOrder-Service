import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Building2,
	Search,
	ArrowRight,
	Loader2,
	ChevronLeft,
} from "lucide-react";
import useClientCompanyServices from "../hooks/client-company-services";

const CompanyList = () => {
	const { companies, loading, error, fetchCompanies } =
		useClientCompanyServices();
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		void fetchCompanies();
	}, []);

	const filteredCompanies = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
				<p className="text-muted-foreground">Memuat data perusahaan...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center">{error}</p>
				</div>
			</div>
		);
	}

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
						Daftar Perusahaan
					</h1>
					<p className="text-muted-foreground">
						Pilih perusahaan untuk melihat layanan - Total {companies.length}{" "}
						perusahaan
					</p>
				</div>
			</div>
			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Cari perusahaan..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10 h-11 border-2 focus:border-primary transition-colors"
					/>
				</div>
			</div>

			{/* Search and Filter */}
			<div className="space-y-6">
				{/* Companies Grid */}
				{filteredCompanies.length === 0 ?
					<div className="text-center py-12">
						<Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<p className="text-lg font-medium text-gray-600">
							Tidak ada perusahaan ditemukan
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							Coba ubah kata kunci pencarian Anda
						</p>
					</div>
				:	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCompanies.map((company) => (
							<Card
								key={company._id}
								className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 overflow-hidden">
								<CardHeader className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="p-3 bg-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											<Building2 className="w-6 h-6 text-white" />
										</div>
										<div className="flex-1 min-w-0">
											<CardTitle className="text-md font-bold truncate group-hover:text-primary transition-colors">
												{company.name}
											</CardTitle>
											<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
												{company.description || "Tidak ada deskripsi"}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<Button
										onClick={() =>
											navigate(
												`/dashboard/client/company/${company._id}/services`,
											)
										}
										className="w-full group/btn bg-blue-600 hover:bg-blue-700 shadow-md">
										<span>Lihat Layanan</span>
										<ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				}
			</div>
		</div>
	);
};

export default CompanyList;
