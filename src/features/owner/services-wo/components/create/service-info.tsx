import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon, CheckIcon, Trash } from "lucide-react";
import { Label as RadixLabel } from "@radix-ui/react-dropdown-menu";

type Status = {
	value: string;
	label: string;
};

type CardServiceInfoProps = {
	title: string;
	description: string;
	accessType: string;
	selectedStatus: Status | null;
	openStatus: boolean;
	statuses: Status[];
	selectedStaff: Staff[];
	positions: Position[];
	loading: boolean;
	error: string | null;

	// setters
	setTitle: (val: string) => void;
	setDescription: (val: string) => void;
	setAccessType: (val: string) => void;
	setSelectedStatus: (val: Status | null) => void;
	setOpenStatus: (val: boolean) => void;
	setSelectedStaff: React.Dispatch<React.SetStateAction<Staff[]>>;

	// handlers
	toggleStaff: (pos: Position) => void;
	fetchPositions?: () => void; // opsional (kalau ingin refetch)
};

export const CardServiceInfo: React.FC<CardServiceInfoProps> = ({
	title,
	description,
	accessType,
	selectedStatus,
	openStatus,
	statuses,
	selectedStaff,
	positions,
	loading,
	error,
	setTitle,
	setDescription,
	setAccessType,
	setSelectedStatus,
	setOpenStatus,
	setSelectedStaff,
	toggleStaff,
	fetchPositions,
}) => {
	return (
		<Card className="p-4 border shadow-md rounded-2xl">
			<CardHeader className="pt-5 px-6">
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground">
						Isi form di bawah untuk menambahkan layanan work order baru.
					</p>
				</div>
			</CardHeader>

			<CardContent className="pb-5 space-y-5">
				{/* Judul Layanan */}
				<div className="space-y-2">
					<Label className="text-sm font-medium">Judul Layanan</Label>
					<Input
						placeholder="Contoh: Cleaning Service"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				{/* Deskripsi */}
				<div className="space-y-2">
					<Label className="text-sm font-medium">Deskripsi Layanan</Label>
					<Input
						placeholder="Contoh: Menjelaskan terkait layanan apa ini"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-3 my-8">
					{/* Status */}
					<div className="flex items-center space-x-4">
						<p className="font-medium text-sm">Status</p>
						<Popover open={openStatus} onOpenChange={setOpenStatus}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-[150px] justify-start text-muted-foreground font-normal">
									{selectedStatus ? selectedStatus.label : "+ Set status"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0" side="right" align="start">
								<Command>
									<CommandList>
										<CommandEmpty>No results found.</CommandEmpty>
										<CommandGroup>
											{statuses.map((status) => (
												<CommandItem
													key={status.value}
													value={status.value}
													onSelect={(value) => {
														const s =
															statuses.find((st) => st.value === value) || null;
														setSelectedStatus(s);
														setOpenStatus(false);
													}}>
													{status.label}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{/* Access Type */}
					<div className="flex items-center gap-3">
						<label className="text-sm font-medium whitespace-nowrap">
							Akses Form
						</label>

						<Select value={accessType} onValueChange={setAccessType}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Pilih Akses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">Public</SelectItem>
								<SelectItem value="internal">Internal</SelectItem>
								<SelectItem value="member_only">Langganan Terdaftar</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Staff Picker */}
				<div className="grid grid-cols-4 gap-2 items-start">
					{/* Selected Staff List */}
					<div className="space-y-2 col-span-3">
						<div className="flex flex-wrap items-start justify-between gap-2 border rounded-md px-3 py-2 mt-1.5 focus-within:ring-2 focus-within:ring-ring transition-all">
							<div className="flex flex-col gap-2 flex-1">
								{selectedStaff.length > 0 ? (
									selectedStaff.map((s) => {
										const pos = positions.find((p) => p._id === s.positionId);
										return (
											<div
												key={s.positionId}
												className="flex items-center justify-between gap-1 border-b pb-2 last:border-none">
												<div className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md border border-primary text-primary transition-colors w-fit">
													<span>{pos?.name || "Tidak diketahui"}</span>
												</div>

												{/* Min & Max Input */}
												<div className="flex items-center gap-2 mt-2">
													<div className="flex items-center gap-1">
														<RadixLabel className="text-xs">Min</RadixLabel>
														<Input
															type="number"
															className="w-16 h-7 text-xs"
															value={s.minimumStaff}
															onChange={(e) => {
																const val = Number(e.target.value);
																setSelectedStaff((prev) =>
																	prev.map((st) =>
																		st.positionId === s.positionId
																			? { ...st, minimumStaff: val }
																			: st
																	)
																);
															}}
														/>
													</div>
													<div className="flex items-center gap-1">
														<RadixLabel className="text-xs">Max</RadixLabel>
														<Input
															type="number"
															className="w-16 h-7 text-xs"
															value={s.maximumStaff}
															onChange={(e) => {
																const val = Number(e.target.value);
																setSelectedStaff((prev) =>
																	prev.map((st) =>
																		st.positionId === s.positionId
																			? { ...st, maximumStaff: val }
																			: st
																	)
																);
															}}
														/>
													</div>
													<Trash
														onClick={(e) => {
															e.stopPropagation();
															setSelectedStaff((prev) =>
																prev.filter(
																	(st) => st.positionId !== s.positionId
																)
															);
														}}
														className="size-4 mx-4 cursor-pointer hover:text-destructive transition-colors"
													/>
												</div>
											</div>
										);
									})
								) : (
									<span className="text-sm text-muted-foreground">
										Pilih beberapa pegawai yang dibutuhkan
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Dropdown pilih posisi */}
					<div className="space-y-2">
						<DropdownMenu
							onOpenChange={(open) =>
								open && fetchPositions && fetchPositions()
							}>
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
											(s) => s.positionId === p._id
										);
										return (
											<DropdownMenuItem
												key={p._id}
												onClick={(e) => {
													e.preventDefault();
													toggleStaff(p);
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
			</CardContent>
		</Card>
	);
};
