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
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";

interface PositionColumnActions {
	onEdit: (position: Position) => void;
	onDelete: (position: Position) => void;
}

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

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
		accessorKey: "createdAt",
		header: "Dibuat",
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">
				{formatDate(row.original.createdAt)}
			</span>
		),
	},
	{
		accessorKey: "updatedAt",
		header: "Diperbarui",
		cell: ({ row }) => (
			<span className="text-sm text-muted-foreground">
				{formatDate(row.original.updatedAt)}
			</span>
		),
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
