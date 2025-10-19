import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckIcon, ChevronDownIcon, Trash } from "lucide-react";

interface StaffSelectorProps {
	positions: Position[];
	selectedStaff: Staff[];
	setSelectedStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
	loading: boolean;
	error: string | null;
	onToggle: (pos: Position) => void;
}

export default function StaffSelector({
	positions,
	selectedStaff,
	setSelectedStaff,
	loading,
	error,
	onToggle,
}: StaffSelectorProps) {
	return (
		<div className="grid grid-cols-4 gap-2 items-start">
			{/* BADGE LIST */}
			<div className="space-y-2 col-span-3">
				<div className="flex flex-wrap items-start justify-between gap-2 border rounded-md px-3 py-2 mt-1.5 focus-within:ring-2 transition-all">
					<div className="flex flex-col gap-2 flex-1">
						{selectedStaff.length > 0 ? (
							selectedStaff.map((p) => (
								<div
									key={p.position._id}
									className="flex items-center justify-between gap-1 border-b pb-2 last:border-none">
									<div className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary w-fit">
										<span>{p.position.name}</span>
									</div>

									<div className="flex items-center gap-2 mt-2">
										<div className="flex items-center gap-1">
											<Label className="text-xs">Min</Label>
											<Input
												type="number"
												className="w-16 h-7 text-xs"
												value={p.minimumStaff}
												onChange={(e) => {
													const val = Number(e.target.value);
													setSelectedStaff((prev) =>
														prev.map((st) =>
															st.position._id === p.position._id
																? { ...st, minimumStaff: val }
																: st
														)
													);
												}}
											/>
										</div>
										<div className="flex items-center gap-1">
											<Label className="text-xs">Max</Label>
											<Input
												type="number"
												className="w-16 h-7 text-xs"
												value={p.maximumStaff}
												onChange={(e) => {
													const val = Number(e.target.value);
													setSelectedStaff((prev) =>
														prev.map((st) =>
															st.position._id === p.position._id
																? { ...st, maximumStaff: val }
																: st
														)
													);
												}}
											/>
										</div>
										<Trash
											onClick={() =>
												setSelectedStaff((prev) =>
													prev.filter((s) => s.position._id !== p.position._id)
												)
											}
											className="size-4 mx-4 cursor-pointer hover:text-destructive transition-colors"
										/>
									</div>
								</div>
							))
						) : (
							<span className="text-sm text-muted-foreground">
								Pilih beberapa pegawai yang dibutuhkan
							</span>
						)}
					</div>
				</div>
			</div>

			{/* DROPDOWN */}
			<div className="space-y-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="w-full shrink-0 mt-2 flex items-center gap-1 text-sm">
							Pilih Pegawai
							<ChevronDownIcon className="w-3 h-3" />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						align="end"
						className="h-[300px] overflow-y-auto w-[250px]">
						{loading ? (
							<DropdownMenuItem disabled>Loading...</DropdownMenuItem>
						) : error ? (
							<DropdownMenuItem disabled>{error}</DropdownMenuItem>
						) : positions.length > 0 ? (
							positions.map((p) => {
								const isSelected = selectedStaff.some(
									(s) => s.position._id === p._id
								);
								return (
									<DropdownMenuItem
										key={p._id}
										onClick={(e) => {
											e.preventDefault();
											onToggle(p);
										}}
										className="flex justify-between">
										<span>{p.name}</span>
										{isSelected && (
											<CheckIcon className="w-4 h-4 text-primary" />
										)}
									</DropdownMenuItem>
								);
							})
						) : (
							<DropdownMenuItem disabled>
								Tidak ada posisi tersedia
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
