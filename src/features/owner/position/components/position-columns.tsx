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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
		header: "No",
		cell: ({ row, table }) => {
			const pageIndex = table.getState().pagination.pageIndex;
			const pageSize = table.getState().pagination.pageSize;
			return pageIndex * pageSize + row.index + 1;
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
					<Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
						Aktif
					</Badge>
				:	<Badge
						variant="outline"
						className="bg-red-50 text-red-500 border-red-200 hover:bg-red-50">
						Nonaktif
					</Badge>;
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
