import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Building2,
	TrendingUp,
	Clock,
	CheckCircle2,
	Search,
	ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCompanyApi } from "./company/services/companyClientService";
import { useNavigate } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { Badge } from "@/components/ui/badge";

const metrics = [
	{
		title: "Total Perusahaan",
		value: "12",
		subtitle: "Perusahaan terdaftar",
		icon: <Building2 className="h-6 w-6" />,
		bg: "bg-blue-50",
		iconBg: "bg-blue-500",
	},
	{
		title: "Permintaan Aktif",
		value: "8",
		subtitle: "Sedang diproses",
		icon: <Clock className="h-6 w-6" />,
		bg: "bg-blue-50",
		iconBg: "bg-blue-600",
	},
	{
		title: "Selesai Bulan Ini",
		value: "24",
		subtitle: "Permintaan selesai",
		icon: <CheckCircle2 className="h-6 w-6" />,
		bg: "bg-blue-50",
		iconBg: "bg-blue-700",
	},
	{
		title: "Tingkat Kepuasan",
		value: "98%",
		subtitle: "Rating rata-rata",
		icon: <TrendingUp className="h-6 w-6" />,
		bg: "bg-blue-50",
		iconBg: "bg-blue-800",
	},
];

const DashboardClient = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const fetchCompanies = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getAllCompanyApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		setCompanies(res?.data || []);
	};

	useEffect(() => {
		void fetchCompanies();
	}, []);

	const filteredCompanies = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-600">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header with Blue Gradient */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-xl">
				<div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
				<div className="relative z-10">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-sm font-medium opacity-90">
							Selamat Datang Kembali
						</span>
					</div>
					<h1 className="text-3xl font-bold mb-2">Dashboard Client</h1>
					<p className="text-blue-100 max-w-2xl">
						Kelola permintaan layanan dan pantau progress pekerjaan Anda dengan
						mudah
					</p>
				</div>
				<div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
			</div>

			{/* Metrics Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((item, i) => (
					<Card
						key={i}
						className={`${item.bg} border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group`}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-gray-700">
								{item.title}
							</CardTitle>
							<div
								className={`${item.iconBg} p-2.5 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
								{item.icon}
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-3xl font-bold text-blue-600">{item.value}</p>
							<p className="text-xs text-gray-600 mt-1">{item.subtitle}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Companies Section */}
			<Card className="shadow-lg border-0">
				<CardHeader className="border-b bg-gradient-to-t from-gray-50 to-white">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl font-bold">
								Daftar Perusahaan
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								{loading ?
									"Memuat data..."
								:	`${filteredCompanies.length} perusahaan tersedia`}
							</p>
						</div>
						<Badge variant="secondary" className="px-3 py-1">
							{companies.length} Total
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="pt-6">
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

					{/* Companies Grid */}
					{loading ?
						<div className="flex items-center justify-center py-12">
							<div className="text-center space-y-3">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
								<p className="text-sm text-muted-foreground">
									Memuat data perusahaan...
								</p>
							</div>
						</div>
					: filteredCompanies.length === 0 ?
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
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardClient;
