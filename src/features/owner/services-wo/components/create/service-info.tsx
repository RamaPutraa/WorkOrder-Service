import { Card } from "@/components/ui/card";
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
import {
	ChevronDownIcon,
	CheckIcon,
	Trash,
	UserIcon,
	UsersIcon,
} from "lucide-react";

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
		<Card className="border shadow-md rounded-lg overflow-hidden h-full flex flex-col">
			<div className="p-4 border-b bg-gradient-to-br from-background to-muted/20 shrink-0">
				<p className="text-sm text-muted-foreground">
					Isi form di bawah untuk menambahkan layanan work order baru.
				</p>
			</div>

			<div className="p-5 lg:p-6 space-y-6 flex-1 overflow-y-auto min-h-0">
				{/* Judul Layanan */}
				<div className="space-y-2">
					<Label
						className={`text-sm font-semibold ${
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
						className={`text-sm font-semibold ${
							errors?.description ? "text-red-500" : "text-foreground"
						}`}>
						Deskripsi Layanan
					</Label>
					<Input
						placeholder="Contoh: Menjelaskan terkait layanan apa ini"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={
							errors?.description ?
								"border-red-500 focus-visible:ring-red-300"
							:	""
						}
					/>
					{errors?.description && (
						<p className="text-xs text-red-500">{errors.description}</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
					{/* Status */}
					<div className="space-y-2">
						<Label
							className={`text-sm font-semibold ${
								errors?.selectedStatus ? "text-red-500" : "text-foreground"
							}`}>
							Status
						</Label>

						<Popover open={openStatus} onOpenChange={setOpenStatus}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={`w-[150px] justify-start font-normal ${
										errors?.selectedStatus ?
											"border-red-500 text-muted-foreground focus-visible:ring-red-300"
										:	"text-muted-foreground"
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
							className={`text-sm font-semibold ${
								errors?.accessType ? "text-red-500" : "text-foreground"
							}`}>
							Akses Layanan
						</Label>

						<Select value={accessType} onValueChange={setAccessType}>
							<SelectTrigger
								className={`w-[200px] ${
									errors?.accessType ?
										"border-red-500 focus-visible:ring-red-300"
									:	""
								}`}>
								<SelectValue placeholder="Pilih Akses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">Publik</SelectItem>
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
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-base font-semibold">
							Konfigurasi Pegawai
						</Label>
						<DropdownMenu
							onOpenChange={(open) =>
								open && fetchPositions && fetchPositions()
							}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="gap-2 border-dashed">
									<ChevronDownIcon className="w-4 h-4" />
									Tambah Posisi
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="h-[300px] overflow-y-auto w-[250px]">
								{loading ?
									<DropdownMenuItem disabled>Loading...</DropdownMenuItem>
								: error ?
									<DropdownMenuItem disabled>{error}</DropdownMenuItem>
								: positions.length > 0 ?
									positions.map((p) => {
										const isSelected = selectedStaff.some(
											(s) => s.positionId === p._id,
										);
										return (
											<DropdownMenuItem
												key={p._id}
												onClick={(e) => {
													e.preventDefault();
													toggleStaff(p);
												}}
												className="flex justify-between cursor-pointer">
												<span>{p.name}</span>
												{isSelected && (
													<CheckIcon className="w-4 h-4 text-primary" />
												)}
											</DropdownMenuItem>
										);
									})
								:	<DropdownMenuItem disabled>
										Tidak ada posisi tersedia
									</DropdownMenuItem>
								}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{selectedStaff.length > 0 ?
							selectedStaff.map((s) => {
								const pos = positions.find((p) => p._id === s.positionId);
								return (
									<div
										key={s.positionId}
										className="relative flex flex-col gap-3 rounded-xl border p-4 bg-card/50 transition-all hover:bg-card">
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-2">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
													<UserIcon className="h-4 w-4" />
												</div>
												<div>
													<p className="font-medium leading-none">
														{pos?.name || "Posisi ?"}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														Atur jumlah staff
													</p>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground hover:text-destructive"
												onClick={() =>
													setSelectedStaff((prev) =>
														prev.filter((st) => st.positionId !== s.positionId),
													)
												}>
												<Trash className="h-4 w-4" />
											</Button>
										</div>

										<div className="grid grid-cols-2 gap-3 pt-2">
											<div className="space-y-1.5">
												<label className="text-xs font-medium text-muted-foreground">
													Minimum
												</label>
												<Input
													type="number"
													min={0}
													className="h-8"
													value={s.minimumStaff}
													onChange={(e) => {
														const val = Number(e.target.value);
														setSelectedStaff((prev) =>
															prev.map((st) =>
																st.positionId === s.positionId ?
																	{ ...st, minimumStaff: val }
																:	st,
															),
														);
													}}
												/>
											</div>
											<div className="space-y-1.5">
												<label className="text-xs font-medium text-muted-foreground">
													Maksimum
												</label>
												<Input
													type="number"
													min={1}
													className="h-8"
													value={s.maximumStaff}
													onChange={(e) => {
														const val = Number(e.target.value);
														setSelectedStaff((prev) =>
															prev.map((st) =>
																st.positionId === s.positionId ?
																	{ ...st, maximumStaff: val }
																:	st,
															),
														);
													}}
												/>
											</div>
										</div>
									</div>
								);
							})
						:	<div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
									<UsersIcon className="h-5 w-5 text-muted-foreground" />
								</div>
								<p className="text-sm font-medium text-muted-foreground">
									Belum ada pegawai dipilih
								</p>
								<p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
									Tambahkan posisi pegawai yang diperlukan untuk layanan ini.
								</p>
							</div>
						}
					</div>

					{errors?.selectedStaff && (
						<p className="text-xs text-red-500 font-medium">
							{errors.selectedStaff}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
};
