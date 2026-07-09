import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
	LoaderCircle,
	Mail,
	Send,
	ChevronsUpDown,
	Check,
	Plus,
	Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInviteEmployee } from "../hooks/use-invite-employee";
import usePosition from "@/features/owner/position/hooks/usePosition";
import {
	inviteEmployeeSchema,
	type InviteEmployeeFormValues,
} from "../schemas/staff-schema";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";
import { useProfileStore } from "@/store/profileStore";
import { FieldDescription } from "@/components/ui/field";

const ROLE_OPTIONS = [
	{ value: "manager_company", label: "Manager Perusahaan" },
	{ value: "staff_company", label: "Staff Perusahaan" },
];

interface InviteEmployeeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const InviteEmployeeDialog = ({
	open,
	onOpenChange,
	onSuccess,
}: InviteEmployeeDialogProps) => {
	const [positionOpen, setPositionOpen] = useState<Record<number, boolean>>({});
	const [showConfirmClose, setShowConfirmClose] = useState(false);
	const { profile } = useProfileStore();

	const isManager = profile?.role === "manager_company";
	const managerPositionId = profile?.position?._id || "";

	const defaultInviteItem = {
		email: "",
		role: isManager ? "staff_company" : "",
		positionId: isManager && managerPositionId ? managerPositionId : "",
	};

	const handleSuccess = () => {
		onOpenChange(false);
		onSuccess?.();
	};

	const { invite, loading } = useInviteEmployee(handleSuccess);
	const { positions, fetchPositions } = usePosition();

	const form = useForm<InviteEmployeeFormValues>({
		resolver: zodResolver(inviteEmployeeSchema),
		defaultValues: {
			invites: [defaultInviteItem],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "invites",
	});

	useEffect(() => {
		if (open) {
			fetchPositions();
			form.reset({ invites: [defaultInviteItem] });
			setPositionOpen({});
			setShowConfirmClose(false);
		}
	}, [open, profile]);

	const togglePositionPopover = (index: number, val: boolean) =>
		setPositionOpen((prev) => ({ ...prev, [index]: val }));

	const onSubmit = (data: InviteEmployeeFormValues) => {
		const payload = {
			...data,
			invites: data.invites.map((inv) => {
				const { positionId, ...rest } = inv;
				// If positionId is empty string, send as undefined/omit
				const cleanPositionId =
					positionId?.trim() === "" ? undefined : positionId;

				if (inv.role === "staff_company") {
					return { ...rest, positionId: cleanPositionId };
				}

				// For manager, include positionId only if it's selected
				return { ...rest, positionId: cleanPositionId };
			}),
		};
		invite(payload as any);
	};

	const { isDirty, isSubmitSuccessful } = form.formState;
	const hasUnsavedChanges = isDirty && !isSubmitSuccessful;

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && hasUnsavedChanges) {
			setShowConfirmClose(true);
		} else {
			onOpenChange(newOpen);
		}
	};

	return (
		<>
			<ConfirmLeaveDialog
				isDirty={hasUnsavedChanges && open}
				isOpen={showConfirmClose}
				onCancel={() => setShowConfirmClose(false)}
				onConfirm={() => {
					setShowConfirmClose(false);
					onOpenChange(false);
				}}
			/>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
					{/* Header - Premium Style */}
					<div className="bg-gradient-to-b from-primary to-primary/70 p-4 text-white relative">
						<div className="relative z-10 flex flex-col gap-1">
							<div className="flex items-center gap-3 text-white text-md">
								<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
									<Send className="w-5 h-5" />
								</div>
								<div>
									<span className="font-bold">Undang Pegawai</span>
									<div className="text-white/80 text-[12px] font-medium">
										Kirim undangan akses ke sistem untuk tim operasional Anda.
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Form Body - Restored Original Content Layout */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="px-6 pt-5 space-y-4 max-h-[55vh] overflow-y-auto">
								{fields.map((field, index) => (
									<div
										key={field.id}
										className="relative rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
										{/* Row number + remove */}
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
												Pegawai {index + 1}
											</span>
											{fields.length > 1 && (
												<button
													type="button"
													onClick={() => remove(index)}
													className="text-gray-300 hover:text-red-400 transition-colors">
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											)}
										</div>

										{/* Email */}
										<FormField
											control={form.control}
											name={`invites.${index}.email`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-gray-500">
														Email
													</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
															<Input
																type="email"
																placeholder="johndoe@gmail.com"
																className="pl-8 h-9 rounded-lg border-gray-200 bg-white text-sm"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>

										{/* Role */}
										<FormField
											control={form.control}
											name={`invites.${index}.role`}
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium text-gray-500">
														Role
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
														disabled={isManager}>
														<FormControl>
															<SelectTrigger className="w-full h-9 rounded-lg border-gray-200 bg-white text-sm">
																<SelectValue placeholder="Pilih role..." />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{ROLE_OPTIONS.map((opt) => (
																<SelectItem
																	key={opt.value}
																	value={opt.value}
																	className="text-sm">
																	{opt.label}
																</SelectItem>
															))}
														</SelectContent>
														{isManager ?
															<FieldDescription className="text-xs italic text-muted-foreground">
																Manager perusahaan hanya dapat mengundang
																pegawai
															</FieldDescription>
														:	null}
													</Select>
													<FormMessage className="text-xs" />
												</FormItem>
											)}
										/>

										{/* Posisi — Combobox */}
										{form.watch(`invites.${index}.role`) !== "" && (
											<FormField
												control={form.control}
												name={`invites.${index}.positionId`}
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs font-medium text-gray-500">
															Departemen{" "}
															{form.watch(`invites.${index}.role`) ===
																"manager_company" && (
																<span className="text-[10px] text-gray-400 font-normal italic">
																	(Opsional)
																</span>
															)}
														</FormLabel>
														<Popover
															open={positionOpen[index]}
															onOpenChange={(val) =>
																togglePositionPopover(index, val)
															}>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant="outline"
																		role="combobox"
																		disabled={isManager && !!managerPositionId}
																		className={cn(
																			"w-full h-9 justify-between rounded-lg border-gray-200 bg-white text-sm font-normal",
																			!field.value && "text-gray-400",
																		)}>
																		{field.value ?
																			(positions.find(
																				(p) => p._id === field.value,
																			)?.name ?? "Pilih departemen...")
																		:	"Pilih departemen..."}
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
																						togglePositionPopover(index, false);
																					}}
																					className="text-sm">
																					<Check
																						className={cn(
																							"mr-2 h-3.5 w-3.5",
																							field.value === pos._id ?
																								"opacity-100 text-blue-600"
																							:	"opacity-0",
																						)}
																					/>
																					{pos.name}
																				</CommandItem>
																			))}
																		</CommandGroup>
																	</CommandList>
																</Command>
															</PopoverContent>
															{isManager && managerPositionId ?
																<FieldDescription className="text-xs italic text-muted-foreground">
																	Manager departemen hanya dapat mengundang
																	pegawai dalam departemennya sendiri
																</FieldDescription>
															:	null}
														</Popover>
														<FormMessage className="text-xs" />
													</FormItem>
												)}
											/>
										)}
									</div>
								))}

								{/* Add more */}
								<button
									type="button"
									onClick={() => append(defaultInviteItem)}
									className="w-full flex items-center justify-center gap-2 mb-3 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:border-blue-300 text-sm font-medium transition-colors">
									<Plus className="w-4 h-4" />
									Tambah Pegawai
								</button>
							</div>

							{/* Footer Actions */}
							<div className="px-6 pb-6 pt-4 bg-white border-t border-slate-50 mt-4">
								<div className="flex flex-row gap-3 w-full">
									<Button
										type="button"
										variant="outline"
										onClick={() => handleOpenChange(false)}
										disabled={loading}
										className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-semibold m-0 text-slate-600 hover:cursor-pointer">
										Batal
									</Button>
									<Button
										type="submit"
										disabled={loading}
										className="flex-1 h-11 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold bg-primary hover:bg-primary/90 m-0 hover:cursor-pointer">
										{loading ?
											<LoaderCircle className="w-4 h-4 animate-spin" />
										:	<Send className="w-4 h-4" />}
										{loading ?
											"Mengirim..."
										:	`Undang ${fields.length} Pegawai`}
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default InviteEmployeeDialog;
