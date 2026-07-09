import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StaffColumnActions {
	onDetail?: (employee: Employee) => void;
}

const roleMap: Record<string, { label: string; color: string }> = {
	owner_company: {
		label: "Owner Perusahaan",
		color: "bg-amber-50 text-amber-700 border-amber-200",
	},
	staff_company: {
		label: "Pegawai Perusahaan",
		color: "bg-blue-50 text-blue-700 border-blue-200",
	},
	manager_company: {
		label: "Manager Perusahaan",
		color: "bg-violet-50 text-violet-700 border-violet-200",
	},
	staff_unassigned: {
		label: "Unassigned",
		color: "bg-slate-50 text-slate-600 border-slate-200",
	},
};

export const createStaffColumns = ({
	onDetail,
}: StaffColumnActions): ColumnDef<Employee>[] => [
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
		cell: ({ row }) => {
			const emp = row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
						<span className="text-xs font-semibold text-primary">
							{emp.name.charAt(0).toUpperCase()}
						</span>
					</div>
					<span className="text-sm font-medium text-slate-800">{emp.name}</span>
				</div>
			);
		},
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
			const roleInfo = roleMap[role] || {
				label: role,
				color: "bg-slate-50 text-slate-600 border-slate-200",
			};

			return (
				<Badge
					variant="outline"
					className={`rounded-full text-xs font-semibold ${roleInfo.color}`}>
					{roleInfo.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "position",
		header: "Departemen",
		cell: ({ row }) => {
			const position = row.original.position;
			return position ?
					<span className="text-sm">{position.name}</span>
				:	<span className="text-sm text-muted-foreground">-</span>;
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => {
			const employee = row.original;

			return (
				<div onClick={(e) => e.stopPropagation()}>
					{onDetail && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDetail(employee)}
							className="h-8 px-3 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5 gap-1.5">
							<Eye className="w-3.5 h-3.5" />
							Lihat Detail
						</Button>
					)}
				</div>
			);
		},
	},
];
