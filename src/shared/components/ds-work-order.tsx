import { useEffect, useState } from "react";
import {
	CheckCircle2,
	Clock,
	ClipboardList,
	FileEdit,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { getInternalCompanyWorkOrders } from "@/features/owner/company-wo/services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<
	WorkOrder["status"],
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	}
> = {
	drafted: { label: "Dirancang", variant: "secondary" },
	sent: { label: "Terkirim", variant: "secondary" },
	approved: { label: "Disetujui", variant: "default" },
	rejected: { label: "Ditolak", variant: "destructive" },
	cancelled: { label: "Dibatalkan", variant: "destructive" },
	unprocessable: { label: "Tidak Dapat Diproses", variant: "destructive" },
	on_progress: { label: "Diproses", variant: "default" },
	completed: { label: "Selesai", variant: "outline" },
	failed: { label: "Gagal", variant: "destructive" },
};

export const workOrderColumns: ColumnDef<WorkOrder>[] = [
	{
		accessorKey: "code",
		header: "Kode WO",
		cell: ({ row }) => (
			<span className="font-mono text-xs font-semibold text-primary">
				{row.getValue("code")}
			</span>
		),
	},
	{
		accessorKey: "service.title",
		header: "Layanan",
		cell: ({ row }) => {
			const service = row.original.service;
			return (
				<div>
					<p className="text-xs font-medium line-clamp-1">
						{service?.title ?? "—"}
					</p>
					<p className="text-[10px] text-muted-foreground line-clamp-1">
						{service?.accessType}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "workOrderApprovalAccessType",
		header: "Departemen Bertugas",
		cell: ({ row }) => {
			const woat = row.original.workOrderApprovalAccessType;
			if (!woat) return <span className="text-xs">—</span>;
			return (
				<span className="text-xs">
					{woat === "auto" ? "Otomatis" : "Pegawai PIC"}
				</span>
			);
		},
	},
	{
		accessorKey: "approvedBy",
		header: "Disetujui Oleh",
		cell: ({ row }) => {
			const approvedBy = row.original.approvedBy;
			return (
				<span className="text-xs line-clamp-1">
					{approvedBy?.name ?? "Disetujui Otomatis"}
				</span>
			);
		},
	},
	{
		accessorKey: "createdBy.name",
		header: "Dibuat Oleh",
		cell: ({ row }) => {
			const creator = row.original.createdBy;
			return (
				<span className="text-xs line-clamp-1">{creator?.name ?? "-"}</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Tanggal",
		cell: ({ row }) => {
			const dateStr = row.getValue("createdAt") as string;
			const fmtDate =
				dateStr ?
					new Intl.DateTimeFormat("id-ID", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					}).format(new Date(dateStr))
				:	"—";
			return <span className="text-xs">{fmtDate}</span>;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as WorkOrder["status"];
			const mapped = STATUS_MAP[status];
			return (
				<Badge variant="outline" className="text-[10px] rounded-full">
					{status === "approved" ?
						<CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
					: status === "drafted" ?
						<FileEdit className="mr-1 h-3 w-3 text-gray-500" />
					: status === "sent" ?
						<Clock className="mr-1 h-3 w-3 text-primary" />
					: status === "rejected" ?
						<XCircle className="mr-1 h-3 w-3 text-destructive" />
					: status === "cancelled" ?
						<XCircle className="mr-1 h-3 w-3 text-destructive" />
					: status === "unprocessable" ?
						<XCircle className="mr-1 h-3 w-3 text-destructive" />
					: status === "on_progress" ?
						<ClipboardList className="mr-1 h-3 w-3 text-primary" />
					: status === "completed" ?
						<CheckCircle className="mr-1 h-3 w-3 text-green-500" />
					: status === "failed" ?
						<XCircle className="mr-1 h-3 w-3 text-destructive" />
					:	null}
					{mapped?.label ?? status}
				</Badge>
			);
		},
	},
];

const DsWorkOrder = () => {
	const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const { data, error } = await handleApi(() =>
				getInternalCompanyWorkOrders(),
			);

			if (!error && data) {
				setWorkOrders(data.data ?? []);
			}
			setLoading(false);
		};

		void fetchData();
	}, []);

	// Calculate Statistics
	const drafted = workOrders.filter((wo) => wo.status === "drafted").length;
	const waiting = workOrders.filter((wo) => wo.status === "sent").length;
	const approved = workOrders.filter((wo) => wo.status === "approved").length;
	const onProgress = workOrders.filter(
		(wo) => wo.status === "on_progress",
	).length;
	const completed = workOrders.filter((wo) => wo.status === "completed").length;

	const statCards = [
		{
			label: "Dirancang",
			value: loading ? "—" : drafted.toString(),
			icon: FileEdit,
		},
		{
			label: "Menunggu Konfirmasi",
			value: loading ? "—" : waiting.toString(),
			icon: Clock,
		},
		{
			label: "Disetujui",
			value: loading ? "—" : approved.toString(),
			icon: CheckCircle2,
		},
		{
			label: "Diproses",
			value: loading ? "—" : onProgress.toString(),
			icon: ClipboardList,
		},
		{
			label: "Selesai",
			value: loading ? "—" : completed.toString(),
			icon: CheckCircle,
		},
	];

	return (
		<>
			<div className="space-y-4">
				{/* badges */}
				<div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-5">
					{statCards.map((stat) => (
						<div
							key={stat.label}
							className="shadow-xs relative overflow-hidden rounded-lg bg-muted border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
							<div className="p-1.5">
								<div className="flex items-start justify-between p-2">
									<div className="space-y-1">
										<p className="text-xs font-medium text-muted-foreground leading-tight">
											{stat.label}
										</p>
									</div>
									<stat.icon className="h-4 w-4 text-muted-foreground" />
								</div>
								<div className="bg-white rounded-lg px-2 pt-4">
									{loading ?
										<Skeleton className="h-8 w-12 mb-1" />
									:	<p className="text-xl font-bold">{stat.value}</p>}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* all wo table */}
				<div className="bg-muted rounded-xl shadow-sm border p-4">
					<div className="p-2">
						<h3 className="text-lg font-semibold text-foreground">
							Daftar Work Order
						</h3>
					</div>

					<div className="rounded-xl p-2">
						<DataTable
							columns={workOrderColumns}
							data={workOrders}
							searchKey="code"
							loading={loading}
							loadingMessage="Memuat Work Order..."
							tableWrapperClassName="bg-white p-3"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DsWorkOrder;
