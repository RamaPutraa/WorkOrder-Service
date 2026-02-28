import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";

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

const ActionCell = ({
	invitation,
	onAccept,
	onReject,
	actionLoadingId,
}: {
	invitation: InvitedHistory;
	onAccept: (id: string) => void;
	onReject: (id: string) => void;
	actionLoadingId: string | null;
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [actionType, setActionType] = useState<"accept" | "reject" | null>(
		null,
	);

	const isAccepting = actionLoadingId === `${invitation._id}-accept`;
	const isRejecting = actionLoadingId === `${invitation._id}-reject`;
	const isPending = isAccepting || isRejecting;

	const handleAction = () => {
		if (actionType === "accept") onAccept(invitation._id);
		if (actionType === "reject") onReject(invitation._id);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
						<span className="sr-only">Open menu</span>
						{isPending ?
							<Loader2 className="h-4 w-4 animate-spin" />
						:	<MoreHorizontal className="h-4 w-4" />}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setActionType("accept");
							setDialogOpen(true);
						}}
						disabled={isPending}>
						<Check className="w-4 h-4 mr-1" />
						Terima
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							setActionType("reject");
							setDialogOpen(true);
						}}
						disabled={isPending}>
						<X className="w-4 h-4 mr-1" />
						Tolak
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog
				open={dialogOpen}
				onOpenChange={(open) => {
					if (!isPending) setDialogOpen(open);
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{actionType === "accept" ? "Terima Undangan?" : "Tolak Undangan?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{actionType === "accept" ?
								"Apakah Anda yakin ingin menerima undangan dari perusahaan ini?"
							:	"Apakah Anda yakin ingin menolak undangan dari perusahaan ini?"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
						<Button
							variant={actionType === "accept" ? "default" : "destructive"}
							onClick={handleAction}
							disabled={isPending}>
							{isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							{actionType === "accept" ? "Ya, Terima" : "Ya, Tolak"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export const getInvitationColumns = ({
	onAccept,
	onReject,
	actionLoadingId,
}: {
	onAccept: (id: string) => void;
	onReject: (id: string) => void;
	actionLoadingId: string | null;
}): ColumnDef<InvitedHistory>[] => [
	{
		id: "company",
		header: "Perusahaan",
		accessorFn: (row) => row.company?.name ?? "",
		cell: ({ row }) => {
			const company = row.original.company;
			return (
				<div>
					<p className="font-medium text-sm">{company?.name ?? "-"}</p>
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
	{
		id: "actions",
		header: "Aksi",
		cell: ({ row }) => {
			const invitation = row.original;
			if (invitation.status !== "pending")
				return <span className="text-sm text-muted-foreground">-</span>;

			return (
				<ActionCell
					invitation={invitation}
					onAccept={onAccept}
					onReject={onReject}
					actionLoadingId={actionLoadingId}
				/>
			);
		},
	},
];
