import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	getFilteredRowModel,
	type ColumnFiltersState,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { SectionLoading } from "@/shared/atoms";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: string;
	loading?: boolean;
	loadingMessage?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey = "name",
	loading = false,
	loadingMessage = "Memuat data...",
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className="space-y-4">
			{/* Search Input */}
			<div className="flex items-center">
				<Input
					placeholder={`Cari ${searchKey}...`}
					value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ?
							<TableRow>
								<TableCell colSpan={columns.length} className="h-36">
									<SectionLoading message={loadingMessage} />
								</TableCell>
							</TableRow>
						: table.getRowModel().rows?.length ?
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						:	<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center">
									Tidak ada data.
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-end space-x-2">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredRowModel().rows.length} dari {data.length} baris
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						<ArrowLeft />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
