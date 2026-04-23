import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX, Clock, Trash2, XCircle } from "lucide-react";

const ROLE_MAP: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	manager_company: { label: "Manager Perusahaan", variant: "outline" },
	staff_company: { label: "Pegawai Perusahaan", variant: "outline" },
	staff_unassigned: { label: "Pegawai Belum Ditugaskan", variant: "outline" },
};

const STATUS_MAP: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	pending: { label: "Menunggu", icon: Clock, variant: "outline" },
	accepted: { label: "Diterima", icon: CheckCircle2, variant: "outline" },
	rejected: { label: "Ditolak", icon: XCircle, variant: "outline" },
	expired: { label: "Kadaluarsa", icon: CircleX, variant: "outline" },
};

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

export const createInvitationColumns = ({
	onDelete,
}: {
	onDelete: (id: string) => void;
}): ColumnDef<InvitationsHistory>[] => [
	{
		id: "email",
		header: "Pegawai",
		accessorFn: (row) => row.user?.email ?? "",
		cell: ({ row }) => {
			const user = row.original.user;
			return (
				<div>
					<p className="font-medium text-sm">{user?.name ?? "-"}</p>
					<p className="text-xs text-muted-foreground">{user?.email ?? "-"}</p>
				</div>
			);
		},
	},
	{
		id: "position",
		header: "Posisi",
		cell: ({ row }) => {
			const pos = row.original.position;
			return <span className="text-sm">{pos?.name ?? "-"}</span>;
		},
	},
	{
		id: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.original.role;
			const info = ROLE_MAP[role] ?? {
				label: role,
				variant: "outline" as const,
			};
			return <Badge variant={info.variant}>{info.label}</Badge>;
		},
	},
	{
		id: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;
			const info = STATUS_MAP[status] ?? {
				label: status,
				variant: "outline" as const,
				icon: XCircle,
			};
			return (
				<Badge variant={info.variant} className="flex items-center gap-1">
					<info.icon
						className={`h-4 w-4 ${
							status === "accepted" ? "text-green-500"
							: status === "rejected" ? "text-red-500"
							: "text-yellow-500"
						}`}
					/>
					{info.label}
				</Badge>
			);
		},
	},
	{
		id: "expiresAt",
		header: "Kadaluarsa",
		cell: ({ row }) => {
			const date = row.original.expiresAt;
			if (!date)
				return <span className="text-sm text-muted-foreground">-</span>;
			return (
				<span className="text-sm text-muted-foreground">
					{formatDate(date)}
				</span>
			);
		},
	},
	{
		id: "createdAt",
		header: "Tanggal Undangan",
		cell: ({ row }) => {
			const date = row.original.createdAt;
			if (!date)
				return <span className="text-sm text-muted-foreground">-</span>;
			return (
				<span className="text-sm text-muted-foreground">
					{formatDate(date)}
				</span>
			);
		},
	},
	{
		id: "actions",
		header: "Aksi",
		cell: ({ row }) => {
			return (
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
					onClick={() => onDelete(row.original._id)}
					title="Hapus riwayat undangan">
					<Trash2 className="h-4 w-4" />
				</Button>
			);
		},
	},
];
