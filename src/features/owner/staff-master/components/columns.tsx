import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Employee>[] = [
	{
		id: "no",
		cell: ({ row, table }) => {
			const pageIndex = table.getState().pagination.pageIndex;
			const pageSize = table.getState().pagination.pageSize;
			return (
				<p className="text-sm text-center text-muted-foreground">
					{pageIndex * pageSize + row.index + 1}
				</p>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Nama",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue("role") as string;
			const roleMap: Record<string, { label: string; variant: any }> = {
				owner_company: { label: "Owner Perusahaan", variant: "outline" },
				staff_company: { label: "Pegawai Perusahaan", variant: "outline" },
				manager_company: { label: "Manager Perusahaan", variant: "outline" },
				staff_unassigned: { label: "Unassigned", variant: "outline" },
			};

			const roleInfo = roleMap[role] || { label: role, variant: "outline" };

			return (
				<Badge variant={roleInfo.variant} className="rounded-full">
					{roleInfo.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "position",
		header: "Posisi",
		cell: ({ row }) => {
			const position = row.original.position;
			return position ?
					<span className="text-sm">{position.name}</span>
				:	<span className="text-sm text-muted-foreground">-</span>;
		},
	},
];
