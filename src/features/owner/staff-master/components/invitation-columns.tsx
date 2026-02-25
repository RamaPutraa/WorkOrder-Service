import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const ROLE_MAP: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	manager_company: { label: "Manager", variant: "default" },
	staff_company: { label: "Staff", variant: "secondary" },
	staff_unassigned: { label: "Unassigned", variant: "outline" },
};

const STATUS_MAP: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	pending: { label: "Menunggu", variant: "outline" },
	accepted: { label: "Diterima", variant: "default" },
	rejected: { label: "Ditolak", variant: "destructive" },
	expired: { label: "Kadaluarsa", variant: "secondary" },
};

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

export const invitationColumns: ColumnDef<InvitationsHistory>[] = [
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
			};
			return <Badge variant={info.variant}>{info.label}</Badge>;
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
];
