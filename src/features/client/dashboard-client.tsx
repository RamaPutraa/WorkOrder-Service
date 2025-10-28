import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Mail,
	Eye,
	MousePointerClick,
	BarChart3,
	Search,
	Filter,
	Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCompanyApi } from "./company/services/companyClientService";
import { useNavigate } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";

const metrics = [
	{
		title: "All Time",
		value: "1.457%",
		subtitle: "X-Ray Leads Captured",
		icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
		bg: "bg-blue-50",
	},
	{
		title: "Sent Emails",
		value: "1.457%",
		subtitle: "X-Ray Leads Captured",
		icon: <Mail className="h-5 w-5 text-purple-500" />,
		bg: "bg-purple-50",
	},
	{
		title: "Open Rate",
		value: "1.457%",
		subtitle: "X-Ray Leads Captured",
		icon: <Eye className="h-5 w-5 text-emerald-500" />,
		bg: "bg-emerald-50",
	},
	{
		title: "Click Rate",
		value: "1.457%",
		subtitle: "X-Ray Leads Captured",
		icon: <MousePointerClick className="h-5 w-5 text-orange-500" />,
		bg: "bg-orange-50",
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

	// Filter pencarian sederhana
	const filteredCompanies = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<div className="flex items-center pb-5">
				<h1 className="text-xl font-semibold">Dashboard Client</h1>
			</div>

			<div className="space-y-12">
				{/* ===== Statistik Card ===== */}
				<Card className="p-6">
					<div className="flex items-center mb-4">
						<h1 className="text-xl font-semibold">Work Order Statistik</h1>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{metrics.map((item, i) => (
							<Card
								key={i}
								className={`${item.bg} border-none shadow-sm hover:shadow-md transition-all duration-200`}>
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										{item.title}
									</CardTitle>
									{item.icon}
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold">{item.value}</p>
									<p className="text-xs text-muted-foreground mt-1">
										{item.subtitle}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</Card>

				{/* ===== Daftar Company ===== */}
				<div className="space-y-4">
					{/* Tabs atas */}
					<Tabs defaultValue="companies" className="w-full">
						<TabsList className="flex justify-start gap-4 bg-transparent border-b">
							<TabsTrigger
								value="companies"
								className="pb-3 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
								Companies
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Toolbar */}
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							{loading
								? "Loading companies..."
								: `${filteredCompanies.length} Companies Found`}
						</p>
						<div className="flex items-center gap-3">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search company..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-8 w-[220px]"
								/>
							</div>
							<Button variant="outline" className="flex items-center gap-2">
								<Filter className="h-4 w-4" />
								Filters
							</Button>
						</div>
					</div>

					{/* Cards Company */}
					{loading ? (
						<p className="text-sm text-muted-foreground text-center py-8">
							Loading data...
						</p>
					) : filteredCompanies.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8">
							No companies found.
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredCompanies.map((company) => (
								<Card
									key={company._id}
									className="shadow-sm hover:shadow-md transition-all">
									<CardHeader className="flex flex-row items-center gap-3">
										<div className="p-2 bg-primary/10 rounded-lg">
											<Building2 className="w-6 h-6 text-primary" />
										</div>
										<div>
											<CardTitle className="text-base">
												{company.name}
											</CardTitle>
											<p className="text-sm text-muted-foreground">
												{company.description}
											</p>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex items-center gap-2 pt-3">
											<Button variant="outline" size="sm" className="flex-1">
												Profile
											</Button>
											<Button
												variant="default"
												size="sm"
												className="flex-1"
												onClick={() =>
													navigate(
														`/dashboard/client/company/${company._id}/services`
													)
												}>
												Lihat Layanan
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default DashboardClient;
