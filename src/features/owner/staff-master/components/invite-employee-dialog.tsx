import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
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

const ROLE_OPTIONS = [
	{ value: "manager_company", label: "Manager Perusahaan" },
	{ value: "staff_company", label: "Staff Perusahaan" },
];

const EMPTY_INVITE = { email: "", role: "", positionId: "" };

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

	const handleSuccess = () => {
		onOpenChange(false);
		onSuccess?.();
	};

	const { invite, loading } = useInviteEmployee(handleSuccess);
	const { positions, fetchPositions } = usePosition();

	const form = useForm<InviteEmployeeFormValues>({
		resolver: zodResolver(inviteEmployeeSchema),
		defaultValues: {
			invites: [EMPTY_INVITE],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "invites",
	});

	useEffect(() => {
		if (open) {
			fetchPositions();
			form.reset({ invites: [EMPTY_INVITE] });
			setPositionOpen({});
			setShowConfirmClose(false);
		}
	}, [open]);

	const togglePositionPopover = (index: number, val: boolean) =>
		setPositionOpen((prev) => ({ ...prev, [index]: val }));

	const onSubmit = (data: InviteEmployeeFormValues) => {
		invite(data);
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
				<DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-2xl">
				{/* Header */}
				<div className="bg-gradient-to-br from-blue-600 to-blue-500 px-6 pt-6 pb-5">
					<div className="flex items-center gap-3 mb-1">
						<div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
							<Send className="w-4 h-4 text-white" />
						</div>
						<DialogTitle className="text-white text-lg font-semibold">
							Undang Pegawai
						</DialogTitle>
					</div>
					<DialogDescription className="text-blue-100 text-sm pl-12">
						Tambahkan satu atau lebih pegawai untuk diundang sekaligus
					</DialogDescription>
				</div>

				{/* Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* Scrollable invite list */}
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
													value={field.value}>
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
												</Select>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>

									{/* Posisi — Combobox */}
									<FormField
										control={form.control}
										name={`invites.${index}.positionId`}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs font-medium text-gray-500">
													Posisi
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
																className={cn(
																	"w-full h-9 justify-between rounded-lg border-gray-200 bg-white text-sm font-normal",
																	!field.value && "text-gray-400",
																)}>
																{field.value ?
																	(positions.find((p) => p._id === field.value)
																		?.name ?? "Pilih posisi...")
																:	"Pilih posisi..."}
																<ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 text-gray-400" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
														<Command>
															<CommandInput
																placeholder="Cari posisi..."
																className="text-sm"
															/>
															<CommandList>
																<CommandEmpty className="py-3 text-center text-sm text-gray-500">
																	Posisi tidak ditemukan
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
												</Popover>
												<FormMessage className="text-xs" />
											</FormItem>
										)}
									/>
								</div>
							))}

							{/* Add more */}
							<button
								type="button"
								onClick={() => append(EMPTY_INVITE)}
								className="w-full flex items-center justify-center gap-2 mb-3 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-500 hover:bg-blue-50 hover:border-blue-300 text-sm font-medium transition-colors">
								<Plus className="w-4 h-4" />
								Tambah Pegawai
							</button>
						</div>

						{/* Footer actions */}
						<div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
							<span className="text-xs text-gray-400">
								{fields.length} pegawai akan diundang
							</span>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => handleOpenChange(false)}
									disabled={loading}
									className="text-gray-500">
									Batal
								</Button>
								<Button
									type="submit"
									size="sm"
									disabled={loading}
									className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4">
									{loading ?
										<LoaderCircle className="w-3.5 h-3.5 animate-spin" />
									:	<Send className="w-3.5 h-3.5" />}
									{loading ? "Mengirim..." : "Kirim Undangan"}
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
