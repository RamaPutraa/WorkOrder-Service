import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Building2,
	TrendingUp,
	Clock,
	CheckCircle2,
	Search,
	MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCompanyApi } from "./company/services/companyClientService";
import { useNavigate } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";

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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<AnimatePresence mode="wait">
							{loading ?
								<motion.div
									key="loading"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="col-span-full flex items-center justify-center py-12">
									<SectionLoading message="Memuat data perusahaan..." />
								</motion.div>
							: filteredCompanies.length === 0 ?
								<motion.div
									key="empty"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="col-span-full text-center py-12">
									<Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
									<p className="text-lg font-medium text-gray-600">
										Tidak ada perusahaan ditemukan
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Coba ubah kata kunci pencarian Anda
									</p>
								</motion.div>
							:	filteredCompanies.map((company) => (
									<motion.div
										key={company._id}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, ease: "easeOut" }}>
										<div
											onClick={() =>
												navigate(
													`/dashboard/client/company/${company._id}/services`,
												)
											}
											className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md hover:cursor-pointer transition-all duration-300 overflow-hidden">
											<div className="space-y-4">
												{/* Baris Atas: Icon, Judul, dan Status */}
												<div className="flex items-start justify-between gap-4 px-4 pt-4">
													<div className="p-3 bg-primary/5 text-primary rounded-xl">
														<Building2 className="w-6 h-6 " />
													</div>
													<div className="flex-1 min-w-0">
														<CardTitle className="text-md font-bold truncate">
															{company.name}
														</CardTitle>
														<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
															{company.address || "Tidak ada alamat"}
														</p>
													</div>
												</div>

												{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
												<div className="px-4 text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
													{company.description ||
														"Tidak ada deskripsi tersedia untuk layanan ini."}
												</div>
											</div>

											<div className="flex items-center justify-between gap-4 p-4 border-t border-slate-200/70">
												<div className="p-3 bg-primary/5 text-primary rounded-xl">
													<MapPin className="w-3 h-3 " />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-xs text-muted-foreground line-clamp-1">
														{company.address || "Tidak ada alamat"}
													</p>
												</div>
											</div>
										</div>
									</motion.div>
								))
							}
						</AnimatePresence>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardClient;
