import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	QrCode,
	LoaderCircle,
	ChevronsUpDown,
	Check,
	Copy,
	CheckCheck,
	Sparkles,
	Hash,
	Infinity,
	CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStaffInvitationCode } from "../hooks/use-staff-invitation-code";
import usePosition from "@/features/owner/position/hooks/usePosition";
import {
	staffInvitationCodeSchema,
	type StaffInvitationCodeFormValues,
} from "../schemas/staff-schema";
import { FieldDescription } from "@/components/ui/field";
import { useProfileStore } from "@/store/profileStore";
import { Badge } from "@/components/ui/badge";

const ROLE_OPTIONS = [
	{ value: "staff_company", label: "Pegawai (Staff)" },
	{ value: "manager_company", label: "Manager Perusahaan" },
];

const EXPIRES_OPTIONS = [
	{ value: "7", label: "7 hari" },
	{ value: "14", label: "14 hari" },
	{ value: "30", label: "30 hari" },
	{ value: "60", label: "60 hari" },
	{ value: "90", label: "90 hari" },
	{ value: "none", label: "Tidak pernah kadaluarsa" },
];

interface CreateInvitationCodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export const CreateInvitationCodeDialog = ({
	open,
	onOpenChange,
	onSuccess,
}: CreateInvitationCodeDialogProps) => {
	const { profile } = useProfileStore();
	const isManager = profile?.role === "manager_company";
	const managerPositionId = profile?.position?._id ?? "";
	const isDeptManager = isManager && !!managerPositionId;

	const { createInvitationCode, submitting } = useStaffInvitationCode();
	const { positions, fetchPositions } = usePosition();

	const [positionOpen, setPositionOpen] = useState(false);
	const [generatedCode, setGeneratedCode] = useState<StaffInvitationCode | null>(null);
	const [copied, setCopied] = useState(false);

	const form = useForm<StaffInvitationCodeFormValues>({
		resolver: zodResolver(staffInvitationCodeSchema),
		defaultValues: {
			role: isManager ? "staff_company" : undefined,
			positionId: isDeptManager ? managerPositionId : "",
			code: "",
			maxUses: undefined,
			expiresInDays: undefined,
		},
	});

	useEffect(() => {
		if (open) {
			fetchPositions();
			form.reset({
				role: isManager ? "staff_company" : undefined,
				positionId: isDeptManager ? managerPositionId : "",
				code: "",
				maxUses: undefined,
				expiresInDays: undefined,
			});
			setGeneratedCode(null);
			setCopied(false);
			setPositionOpen(false);
		}
	}, [open, profile]);

	const selectedRole = form.watch("role");

	const onSubmit = async (data: StaffInvitationCodeFormValues) => {
		const payload: CreateStaffInvitationCodeRequest = {
			role: data.role,
			positionId: data.positionId?.trim() || undefined,
			code: data.code?.trim() || undefined,
			maxUses: data.maxUses,
			expiresInDays: data.expiresInDays,
		};
		const result = await createInvitationCode(payload);
		if (result) {
			setGeneratedCode(result);
			onSuccess?.();
		}
	};

	const handleCopy = () => {
		if (!generatedCode) return;
		navigator.clipboard.writeText(generatedCode.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2500);
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	// Result screen
	if (generatedCode) {
		return (
			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
					{/* Header */}
					<div className="bg-gradient-to-b from-indigo-600 to-indigo-500 p-5 text-white">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-white/20 shadow-xl">
								<Sparkles className="w-5 h-5" />
							</div>
							<div>
								<span className="font-bold text-md">Kode Berhasil Dibuat!</span>
								<div className="text-white/75 text-[11px] font-medium mt-0.5">
									Bagikan kode ini kepada pegawai Anda
								</div>
							</div>
						</div>
					</div>

					<div className="px-6 py-6 space-y-5 bg-white">
						{/* Code display */}
						<div className="flex items-center justify-between gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4">
							<div className="flex items-center gap-2">
								<Hash className="w-4 h-4 text-indigo-400 shrink-0" />
								<span className="font-mono text-2xl font-bold text-indigo-700 tracking-widest">
									{generatedCode.code}
								</span>
							</div>
							<button
								onClick={handleCopy}
								className={cn(
									"flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
									copied
										? "bg-emerald-100 text-emerald-700"
										: "bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-100",
								)}
							>
								{copied ? (
									<CheckCheck className="w-3.5 h-3.5" />
								) : (
									<Copy className="w-3.5 h-3.5" />
								)}
								{copied ? "Tersalin!" : "Salin"}
							</button>
						</div>

						{/* Info pills */}
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline" className="rounded-full text-xs border-indigo-200 text-indigo-700 bg-indigo-50">
								{generatedCode.role === "staff_company" ? "Pegawai Staff" : "Manager Perusahaan"}
							</Badge>
							{generatedCode.position && (
								<Badge variant="outline" className="rounded-full text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
									{generatedCode.position.name}
								</Badge>
							)}
							<Badge variant="outline" className="rounded-full text-xs flex items-center gap-1 border-slate-200 text-slate-600">
								{generatedCode.maxUses === null ? (
									<><Infinity className="w-3 h-3" /> Tidak terbatas</>
								) : (
									`Maks. ${generatedCode.maxUses} klaim`
								)}
							</Badge>
							{generatedCode.expiresAt ? (
								<Badge variant="outline" className="rounded-full text-xs flex items-center gap-1 border-amber-200 text-amber-700 bg-amber-50">
									<CalendarClock className="w-3 h-3" />
									{new Date(generatedCode.expiresAt).toLocaleDateString("id-ID", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</Badge>
							) : (
								<Badge variant="outline" className="rounded-full text-xs border-slate-200 text-slate-500">
									Tidak kadaluarsa
								</Badge>
							)}
						</div>

						<p className="text-xs text-slate-400 leading-relaxed">
							Pegawai cukup memasukkan kode ini di aplikasi mereka untuk langsung
							bergabung dengan perusahaan Anda.
						</p>

						<Button
							onClick={handleClose}
							className="w-full h-11 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
						>
							Selesai
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	// Form screen
	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* Header */}
				<div className="bg-gradient-to-b from-indigo-600 to-indigo-500 p-4 text-white">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
							<QrCode className="w-5 h-5" />
						</div>
						<div>
							<span className="font-bold text-md">Generate Kode Undangan</span>
							<div className="text-white/75 text-[11px] font-medium mt-0.5">
								Buat kode unik untuk pegawai bergabung ke perusahaan
							</div>
						</div>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="px-6 pt-5 pb-2 space-y-4 max-h-[60vh] overflow-y-auto">
							{/* Role */}
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-gray-500">
											Role Pegawai
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={isManager}
										>
											<FormControl>
												<SelectTrigger className="w-full h-9 rounded-lg border-gray-200 bg-white text-sm">
													<SelectValue placeholder="Pilih role..." />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{ROLE_OPTIONS.filter(
													(opt) =>
														!isManager || opt.value === "staff_company",
												).map((opt) => (
													<SelectItem
														key={opt.value}
														value={opt.value}
														className="text-sm"
													>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{isManager && (
											<FieldDescription className="text-xs italic text-muted-foreground">
												Manager perusahaan hanya dapat membuat kode untuk pegawai
											</FieldDescription>
										)}
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* Posisi */}
							{selectedRole && (
								<FormField
									control={form.control}
									name="positionId"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-gray-500">
												Departemen / Posisi{" "}
												{selectedRole === "manager_company" && (
													<span className="text-[10px] text-gray-400 font-normal italic">
														(Opsional)
													</span>
												)}
											</FormLabel>
											<Popover
												open={positionOpen}
												onOpenChange={setPositionOpen}
											>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															disabled={isDeptManager}
															className={cn(
																"w-full h-9 justify-between rounded-lg border-gray-200 bg-white text-sm font-normal",
																!field.value && "text-gray-400",
															)}
														>
															{field.value
																? (positions.find(
																		(p) => p._id === field.value,
																	)?.name ?? "Pilih departemen...")
																: "Pilih departemen..."}
															<ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 text-gray-400" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
													<Command>
														<CommandInput
															placeholder="Cari departemen..."
															className="text-sm"
														/>
														<CommandList>
															<CommandEmpty className="py-3 text-center text-sm text-gray-500">
																Departemen tidak ditemukan
															</CommandEmpty>
															<CommandGroup>
																{positions.map((pos) => (
																	<CommandItem
																		key={pos._id}
																		value={pos.name}
																		onSelect={() => {
																			field.onChange(pos._id);
																			setPositionOpen(false);
																		}}
																		className="text-sm"
																	>
																		<Check
																			className={cn(
																				"mr-2 h-3.5 w-3.5",
																				field.value === pos._id
																					? "opacity-100 text-indigo-600"
																					: "opacity-0",
																			)}
																		/>
																		{pos.name}
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											{isDeptManager && (
												<FieldDescription className="text-xs italic text-muted-foreground">
													Manager departemen hanya dapat membuat kode untuk
													departemennya sendiri
												</FieldDescription>
											)}
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>
							)}

							{/* Kode kustom (opsional) */}
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-gray-500">
											Kode Kustom{" "}
											<span className="text-[10px] text-gray-400 font-normal italic">
												(Opsional  biarkan kosong untuk auto-generate)
											</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Contoh: TEKNISI2026"
												className="h-9 rounded-lg border-gray-200 bg-white text-sm uppercase placeholder:normal-case"
												{...field}
												onChange={(e) =>
													field.onChange(e.target.value.toUpperCase())
												}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* Batas penggunaan (opsional) */}
							<FormField
								control={form.control}
								name="maxUses"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-gray-500">
											Batas Penggunaan{" "}
											<span className="text-[10px] text-gray-400 font-normal italic">
												(Opsional  kosongkan untuk tidak terbatas)
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={1}
												placeholder="Misal: 10"
												className="h-9 rounded-lg border-gray-200 bg-white text-sm"
												value={field.value ?? ""}
												onChange={(e) => {
													const v = e.target.value;
													field.onChange(v === "" ? undefined : Number(v));
												}}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							{/* Masa berlaku */}
							<FormField
								control={form.control}
								name="expiresInDays"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-medium text-gray-500">
											Masa Berlaku
										</FormLabel>
										<Select
											value={field.value !== undefined ? String(field.value) : "none"}
											onValueChange={(v) =>
												field.onChange(v === "none" ? undefined : Number(v))
											}
										>
											<FormControl>
												<SelectTrigger className="w-full h-9 rounded-lg border-gray-200 bg-white text-sm">
													<SelectValue placeholder="Pilih masa berlaku..." />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{EXPIRES_OPTIONS.map((opt) => (
													<SelectItem
														key={opt.value || "never"}
														value={opt.value}
														className="text-sm"
													>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>

						{/* Footer */}
						<div className="px-6 pb-6 pt-4 bg-white border-t border-slate-50 mt-4">
							<div className="flex flex-row gap-3 w-full">
								<Button
									type="button"
									variant="outline"
									onClick={handleClose}
									disabled={submitting}
									className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-600 hover:cursor-pointer"
								>
									Batal
								</Button>
								<Button
									type="submit"
									disabled={submitting}
									className="flex-1 h-11 rounded-xl shadow-sm hover:shadow-md font-semibold bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer transition-all"
								>
									{submitting ? (
										<>
											<LoaderCircle className="w-4 h-4 animate-spin mr-2" />
											Membuat...
										</>
									) : (
										<>
											<QrCode className="w-4 h-4 mr-2" />
											Generate Kode
										</>
									)}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

