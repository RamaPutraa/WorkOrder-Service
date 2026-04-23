import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const employee = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(employee._id)}>
							Copy ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => console.log("Edit", employee)}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => console.log("Delete", employee)}
							className="text-red-600">
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
