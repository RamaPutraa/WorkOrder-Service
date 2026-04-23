import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CheckCircleIcon,
	MoreHorizontal,
	Pencil,
	Trash2,
	XCircleIcon,
} from "lucide-react";

interface PositionColumnActions {
	onEdit: (position: Position) => void;
	onDelete: (position: Position) => void;
}

export const createPositionColumns = ({
	onEdit,
	onDelete,
}: PositionColumnActions): ColumnDef<Position>[] => [
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
		header: "Nama Departemen",
	},
	{
		accessorKey: "description",
		header: "Deskripsi Departemen",
	},
	{
		id: "status",
		header: "Status",
		cell: ({ row }) => {
			const { isActive } = row.original;
			return isActive ?
					<div className="flex w-fit items-center text-xs  border border-border px-2 py-1 rounded-full">
						<CheckCircleIcon size={12} className="mr-1 text-green-500" />
						Aktif
					</div>
				:	<div className="flex w-fit items-center text-xs  border border-border px-2 py-1 rounded-full">
						<XCircleIcon size={12} className="mr-1 text-red-500" />
						Nonaktif
					</div>;
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const position = row.original;

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
						<DropdownMenuItem onClick={() => onEdit(position)}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onDelete(position)}
							className="text-red-600">
							<Trash2 className="mr-2 h-4 w-4" />
							Hapus
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
