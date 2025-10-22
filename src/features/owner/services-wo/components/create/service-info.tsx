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

	errors?: Record<string, string>;
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
	errors,
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
					<Label
						className={`text-sm font-medium ${
							errors?.title ? "text-red-500" : "text-foreground"
						}`}>
						Judul Layanan
					</Label>

					<Input
						placeholder="Contoh: Cleaning Service"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={
							errors?.title ? "border-red-500 focus-visible:ring-red-300" : ""
						}
					/>

					{errors?.title && (
						<p className="text-xs text-red-500">{errors.title}</p>
					)}
				</div>

				{/* Deskripsi */}
				<div className="space-y-2">
					<Label
						className={`text-sm font-medium ${
							errors?.description ? "text-red-500" : "text-foreground"
						}`}>
						Deskripsi Layanan
					</Label>
					<Input
						placeholder="Contoh: Menjelaskan terkait layanan apa ini"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={
							errors?.description
								? "border-red-500 focus-visible:ring-red-300"
								: ""
						}
					/>
					{errors?.description && (
						<p className="text-xs text-red-500">{errors.description}</p>
					)}
				</div>

				<div className="grid grid-cols-3 my-8 gap-5">
					{/* Status */}
					<div className="space-y-2">
						<Label
							className={`text-sm font-medium ${
								errors?.selectedStatus ? "text-red-500" : "text-foreground"
							}`}>
							Status
						</Label>

						<Popover open={openStatus} onOpenChange={setOpenStatus}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={`w-[150px] justify-start font-normal ${
										errors?.selectedStatus
											? "border-red-500 text-muted-foreground focus-visible:ring-red-300"
											: "text-muted-foreground"
									}`}>
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

						{errors?.selectedStatus && (
							<p className="text-xs text-red-500">{errors.selectedStatus}</p>
						)}
					</div>

					{/* Access Type */}
					<div className="space-y-2">
						<Label
							className={`text-sm font-medium ${
								errors?.accessType ? "text-red-500" : "text-foreground"
							}`}>
							Akses Form
						</Label>

						<Select value={accessType} onValueChange={setAccessType}>
							<SelectTrigger
								className={`w-[200px] ${
									errors?.accessType
										? "border-red-500 focus-visible:ring-red-300"
										: ""
								}`}>
								<SelectValue placeholder="Pilih Akses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">Public</SelectItem>
								<SelectItem value="internal">Internal</SelectItem>
								<SelectItem value="member_only">Langganan Terdaftar</SelectItem>
							</SelectContent>
						</Select>

						{errors?.accessType && (
							<p className="text-xs text-red-500">{errors.accessType}</p>
						)}
					</div>
				</div>

				{/* Staff Picker */}
				<div className="grid grid-cols-4 gap-2 items-start">
					{/* Selected Staff List */}
					<div className="space-y-2 col-span-3">
						{/* Label */}
						<p
							className={`text-sm font-medium ${
								errors?.selectedStaff ? "text-red-500" : "text-foreground"
							}`}>
							Daftar Pegawai Terpilih
						</p>

						{/* Container */}
						<div
							className={`flex flex-wrap items-start justify-between gap-2 rounded-md px-3 py-2 mt-1.5 transition-all border 
				${
					errors?.selectedStaff
						? "border-red-500 ring-2 ring-red-300"
						: "border-border focus-within:ring-2 focus-within:ring-ring"
				}`}>
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
														<RadixLabel
															className={`text-xs ${
																errors?.selectedStaff ? "text-red-500" : ""
															}`}>
															Min
														</RadixLabel>
														<Input
															type="number"
															className={`w-16 h-7 text-xs ${
																errors?.selectedStaff
																	? "border-red-500 focus-visible:ring-red-500"
																	: ""
															}`}
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
														<RadixLabel
															className={`text-xs ${
																errors?.selectedStaff ? "text-red-500" : ""
															}`}>
															Max
														</RadixLabel>
														<Input
															type="number"
															className={`w-16 h-7 text-xs ${
																errors?.selectedStaff
																	? "border-red-500 focus-visible:ring-red-500"
																	: ""
															}`}
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
									<span
										className={`text-sm ${
											errors?.selectedStaff
												? "text-red-500"
												: "text-muted-foreground"
										}`}>
										Pilih beberapa pegawai yang dibutuhkan
									</span>
								)}
							</div>
						</div>

						{/* Pesan error di bawah box */}
						{errors?.selectedStaff && (
							<p className="text-xs text-red-500">{errors.selectedStaff}</p>
						)}
					</div>

					{/* Dropdown pilih posisi */}
					<div className="space-y-2">
						<label
							className={`text-sm font-medium ${
								errors?.selectedStaff ? "text-red-500" : ""
							}`}>
							Tambah Pegawai
						</label>

						<DropdownMenu
							onOpenChange={(open) =>
								open && fetchPositions && fetchPositions()
							}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className={`w-full shrink-0 mt-2 flex items-center gap-1 text-sm transition-colors ${
										errors?.selectedStaff
											? "border-red-500 text-red-500 hover:bg-red-50"
											: ""
									}`}>
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
