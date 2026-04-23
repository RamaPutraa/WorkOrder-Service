import { useEffect, useState, useMemo } from "react";
import { handleApi } from "@/lib/handle-api";
import { getAllInternalBusinessServiceRequestApi } from "@/features/owner/business/services/internal-business-services";
import { notifyError } from "@/lib/toast-helper";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ClipboardList,
	Search,
	Filter,
	User2,
	CalendarDays,
	CheckCircle2,
	Clock,
	Settings,
	FileText,
	CheckCircle,
	MessageSquare,
	Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── helpers ────────────────────────────────────────────────────────────────
type SRStatus = InboxSR["serviceRequestStatus"];

const STATUS_MAP: Record<
	SRStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	received: { label: "Diterima", variant: "secondary" },
	approved: { label: "Disetujui", variant: "default" },
	rejected: { label: "Ditolak", variant: "destructive" },
	cancelled: { label: "Dibatalkan", variant: "destructive" },
	on_progress: { label: "Berlangsung", variant: "default" },
	completed: { label: "Selesai", variant: "secondary" },
	partial_completed: { label: "Sebagian Selesai", variant: "outline" },
	unprocessable: { label: "Tidak Dapat Diproses", variant: "destructive" },
	closed: { label: "Ditutup", variant: "outline" },
};

const STATUS_COLORS: Record<SRStatus, string> = {
	received: "bg-blue-100 text-blue-700 border-blue-200",
	approved: "bg-primary/10 text-primary border-primary/20",
	rejected: "bg-red-100 text-red-700 border-red-200",
	cancelled: "bg-red-100 text-red-700 border-red-200",
	on_progress: "bg-amber-100 text-amber-700 border-amber-200",
	completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
	partial_completed: "bg-violet-100 text-violet-700 border-violet-200",
	unprocessable: "bg-red-100 text-red-700 border-red-200",
	closed: "bg-muted text-muted-foreground border-border",
};

const fmt = (d: string) =>
	new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(d));

// ── Data Statik Timeline ─────────────────────────────────────────────────────
const PROCESS_FLOW_STEPS = [
	{
		title: "Permohonan Permintaan",
		desc: "Pembuatan tiket layanan baru oleh pemohon.",
		step: "Langkah 1",
		icon: FileText,
		color: "text-blue-600",
		bg: "bg-blue-100 ring-blue-50",
	},
	{
		title: "Konfirmasi Permintaan",
		desc: "Pengecekan dan persetujuan oleh manager/owner.",
		step: "Langkah 2",
		icon: CheckCircle,
		color: "text-emerald-600",
		bg: "bg-emerald-100 ring-emerald-50",
	},
	{
		title: "Proses",
		desc: "Pengerjaan layanan oleh teknisi / tim terkait.",
		step: "Langkah 3",
		icon: Settings,
		color: "text-amber-600",
		bg: "bg-amber-100 ring-amber-50",
	},
	{
		title: "Review Pekerjaan",
		desc: "Validasi hasil pekerjaan yang telah dilakukan.",
		step: "Langkah 4",
		icon: MessageSquare,
		color: "text-indigo-600",
		bg: "bg-indigo-100 ring-indigo-50",
	},
	{
		title: "Selesai ",
		desc: "Layanan selesai sepenuhnya dan tiket ditutup.",
		step: "Langkah 5",
		icon: Flag,
		color: "text-green-600",
		bg: "bg-green-100 ring-green-50",
	},
];

// ── component ──────────────────────────────────────────────────────────────
const DsServiceRequest = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<InboxSR[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			const { data: res, error } = await handleApi(() =>
				getAllInternalBusinessServiceRequestApi(),
			);
			setLoading(false);
			if (error) {
				notifyError("Gagal memuat service request", error.message);
				return;
			}
			setData(res?.data ?? []);
		};
		void fetch();
	}, []);

	const filtered = useMemo(() => {
		return data.filter((sr) => {
			const matchSearch =
				!search ||
				sr.service?.title.toLowerCase().includes(search.toLowerCase()) ||
				sr.code.toLowerCase().includes(search.toLowerCase()) ||
				sr.requestedBy?.name?.toLowerCase().includes(search.toLowerCase());
			const matchStatus =
				statusFilter === "all" || sr.serviceRequestStatus === statusFilter;
			return matchSearch && matchStatus;
		});
	}, [data, search, statusFilter]);

	const toDetail = (id: string) => navigate(`/owner/business/${id}`);

	const statCards = [
		{
			label: "Total Permohonan Layanan",
			value: "—",
			icon: ClipboardList,
			badge: "Masuk",
			badgeVariant: "default" as const,
		},
		{
			label: "Perlu Persetujuan",
			value: "—",
			icon: CheckCircle2,
			badge: "Bulan ini",
			badgeVariant: "secondary" as const,
		},
		{
			label: "Sedang Diproses",
			value: "—",
			icon: Clock,
			badge: "Bulan ini",
			badgeVariant: "secondary" as const,
		},
		{
			label: "Selesai & Ditutup",
			value: "—",
			icon: Clock,
			badge: "On Progress",
			badgeVariant: "secondary" as const,
		},
	];

	return (
		<>
			{/* Stat cards */}
			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-2">
					<div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-4">
						{statCards.map((stat) => (
							<div
								key={stat.label}
								className="shadow-xs relative overflow-hidden rounded-lg bg-muted border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
								<div className="p-1.5">
									<div className="flex items-start justify-between p-2">
										<div className="space-y-1">
											<p className="text-sm font-medium text-muted-foreground leading-tight">
												{stat.label}
											</p>
										</div>
										<stat.icon className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="bg-white rounded-lg px-2 pt-5">
										<p className="text-2xl font-bold">0</p>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="border shadow-sm bg-muted rounded-lg py-2">
						<div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
									<ClipboardList className="h-4 w-4 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold">
										Daftar Permintaan Layanan
									</CardTitle>
									<p className="text-xs text-muted-foreground">
										{data.length} total permintaan layanan
									</p>
								</div>
							</div>

							{/* Filters */}
							<div className="flex flex-wrap items-center gap-2">
								<div className="relative bg-white rounded-lg">
									<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
									<Input
										placeholder="Cari kode / layanan / pemohon..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="h-8 w-56 pl-8 text-xs"
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="h-8 w-40 text-xs gap-1 bg-white">
										<Filter className="h-3 w-3 text-muted-foreground" />
										<SelectValue placeholder="Semua Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua Status</SelectItem>
										{(Object.keys(STATUS_MAP) as SRStatus[]).map((s) => (
											<SelectItem key={s} value={s}>
												{STATUS_MAP[s].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="p-0 bg-white rounded-lg mx-2 border">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-muted/40 hover:bg-muted/40">
											<TableHead className="text-xs font-semibold w-[100px]">
												Kode
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Layanan
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Pemohon
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Tanggal
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Status
											</TableHead>
											<TableHead className="text-xs font-semibold">
												Approval
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{loading ?
											Array.from({ length: 4 }).map((_, i) => (
												<TableRow key={i}>
													{Array.from({ length: 6 }).map((_, j) => (
														<TableCell key={j}>
															<Skeleton className="h-4 w-full" />
														</TableCell>
													))}
												</TableRow>
											))
										: filtered.length === 0 ?
											<TableRow>
												<TableCell
													colSpan={6}
													className="text-center py-10 text-muted-foreground text-sm">
													Tidak ada data service request
												</TableCell>
											</TableRow>
										:	filtered.slice(0, 8).map((sr) => (
												<TableRow
													key={sr._id}
													className="cursor-pointer transition-colors hover:bg-primary/5"
													onClick={() => toDetail(sr._id)}>
													<TableCell>
														<span className="font-mono text-xs font-semibold text-primary">
															{sr.code}
														</span>
													</TableCell>
													<TableCell>
														<p className="text-xs font-medium line-clamp-1">
															{sr.service?.title ?? "—"}
														</p>
														<p className="text-[10px] text-muted-foreground line-clamp-1">
															{sr.service?.accessType}
														</p>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1.5">
															<User2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
															<span className="text-xs line-clamp-1">
																{sr.requestedBy?.name ?? "—"}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															<CalendarDays className="h-3 w-3 text-muted-foreground shrink-0" />
															<span className="text-xs">
																{fmt(sr.createdAt)}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<span
															className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[sr.serviceRequestStatus]}`}>
															{STATUS_MAP[sr.serviceRequestStatus]?.label}
														</span>
													</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="text-[10px] px-1.5 py-0 capitalize">
															{sr.serviceRequestApprovalAccessType === "auto" ?
																"Otomatis"
															:	"Manager"}
														</Badge>
													</TableCell>
												</TableRow>
											))
										}
									</TableBody>
								</Table>
							</div>
							{filtered.length > 8 && (
								<div className="border-t px-4 py-2 text-center">
									<button
										onClick={() => navigate("/owner/business")}
										className="text-xs font-medium text-primary hover:underline">
										Lihat semua {filtered.length} service request →
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="col-span-1">
					<div className="bg-muted border shadow-sm rounded-lg h-full flex flex-col">
						{/* Header */}
						<div className="p-4  flex items-center justify-between">
							<div>
								<h3 className="text-md font-semibold text-foreground">
									Alur Proses
								</h3>
								<p className="text-xs text-muted-foreground mt-0.5">
									Standar operasional layanan
								</p>
							</div>
							<div className="p-1.5">
								<Settings className="w-4 h-4 text-muted-foreground" />
							</div>
						</div>

						{/* Timeline Body */}
						<div className="p-5 flex-1 bg-white rounded-lg mx-2 mb-2 border shadow-sm">
							<div className="space-y-2">
								{" "}
								{/* space-y diubah ke 2 karena kita pakai padding dalam item */}
								{PROCESS_FLOW_STEPS.map((step, idx) => {
									const isFirst = idx === 0;
									const isLast = idx === PROCESS_FLOW_STEPS.length - 1;

									return (
										<div
											key={idx}
											className="group relative flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-all duration-200">
											{/* Garis Putus-putus */}
											{!isLast && (
												// Posisi left & top disesuaikan dengan padding baru
												<div className="absolute left-8 top-12 bottom-[-1rem] w-px border-l-2 border-dashed border-slate-200 group-hover:border-slate-300 transition-colors" />
											)}

											{/* Icon Kotak Bulat dengan Efek Hover */}
											<div
												className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${step.bg} ${step.color}`}>
												<step.icon className="h-5 w-5" />
											</div>

											{/* Konten Teks */}
											<div className="flex flex-1 flex-col pb-1">
												<div className="flex items-center justify-between gap-2">
													<div className="flex items-center gap-2">
														<span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
															{step.title}
														</span>
														{/* Badge Start / End Dinamis */}
														{isFirst && (
															<span className="px-1.5  rounded-[4px] bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider">
																Start
															</span>
														)}
														{isLast && (
															<span className="px-1.5  rounded-[4px] bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider">
																End
															</span>
														)}
													</div>

													{/* Step Badge yang lebih solid */}
													<span className="text-[10px] font-bold px-2  rounded-full bg-slate-100 text-slate-500 whitespace-nowrap border border-slate-200/60">
														{step.step}
													</span>
												</div>

												<span className="text-xs text-slate-500 mt-1.5 leading-relaxed">
													{step.desc}
												</span>

												{/* Baris Informasi Ekstra (Makin Ramai) */}
												<div className="flex items-center gap-4  opacity-70 group-hover:opacity-100 transition-opacity duration-300">
													<div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
														<User2 className="w-3 h-3 text-slate-400" />
														<span>
															{/* Mockup Aktor Statik berdasarkan index */}
															{idx === 0 ?
																"Pemohon"
															: idx === 1 ?
																"Manager / Owner"
															: idx === 2 ?
																"Teknisi Internal"
															: idx === 3 ?
																"Pemohon / QA"
															:	"Sistem Otomatis"}
														</span>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DsServiceRequest;
