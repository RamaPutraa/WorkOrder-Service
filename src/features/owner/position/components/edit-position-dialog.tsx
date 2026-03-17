import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Briefcase, FileText, Save, LoaderCircle } from "lucide-react";
import { useUpdatePosition } from "../hooks/usePosition";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";

// ─── Schema ───────────────────────────────────────────────────────────────────
const editPositionSchema = z.object({
	name: z.string().min(1, "Nama posisi wajib diisi"),
	description: z.string().min(1, "Deskripsi posisi wajib diisi"),
});

type EditPositionFormValues = z.infer<typeof editPositionSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface EditPositionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	position: Position;
	onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const EditPositionDialog = ({
	open,
	onOpenChange,
	position,
	onSuccess,
}: EditPositionDialogProps) => {
	const [isActiveLocal, setIsActiveLocal] = useState(position.isActive);

	const [showConfirmClose, setShowConfirmClose] = useState(false);

	const { updatePosition, loading } = useUpdatePosition(() => {
		onOpenChange(false);
		onSuccess();
	});

	const form = useForm<EditPositionFormValues>({
		resolver: zodResolver(editPositionSchema),
		defaultValues: {
			name: position.name,
			description: position.description,
		},
	});

	// Reset form + local state setiap kali dialog dibuka
	useEffect(() => {
		if (open) {
			form.reset({
				name: position.name,
				description: position.description,
			});
			setIsActiveLocal(position.isActive);
			setShowConfirmClose(false);
		}
	}, [open, position]);

	// ── Form submit ────────────────────────────────────────────────────────────
	const onSubmit = async (values: EditPositionFormValues) => {
		await updatePosition(position._id, {
			name: values.name,
			description: values.description,
			isActive: isActiveLocal,
		});
	};

	const { isDirty: isFormDirty, isSubmitSuccessful } = form.formState;

	const isSwitchDirty = isActiveLocal !== position.isActive;

	const hasUnsavedChanges =
		(isFormDirty || isSwitchDirty) && !isSubmitSuccessful;

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
					<div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-5">
						<div className="flex items-center gap-3 mb-1">
							<div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
								<Briefcase className="w-4 h-4 text-white" />
							</div>
							<DialogTitle className="text-white text-lg font-semibold">
								Edit Posisi
							</DialogTitle>
						</div>
						<DialogDescription className="text-primary-foreground/70 text-sm pl-12">
							Perbarui informasi posisi / departemen
						</DialogDescription>
					</div>

					{/* Form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="px-6 pt-5 pb-2 space-y-4">
								{/* Nama */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground">
												Nama Posisi
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
													<Input
														placeholder="Nama posisi / departemen"
														className="pl-8 h-9 rounded-lg text-sm"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								{/* Deskripsi */}
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground">
												Deskripsi
											</FormLabel>
											<FormControl>
												<div className="relative">
													<FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
													<Textarea
														placeholder="Deskripsi singkat tentang posisi ini..."
														className="pl-8 min-h-[80px] rounded-lg text-sm resize-none"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								{/* isActive Toggle */}
								<div className="flex items-center justify-between rounded-lg border px-4 py-3 bg-muted/30">
									<div className="space-y-0.5">
										<p className="text-sm font-medium">Status Aktif</p>
										<p className="text-xs text-muted-foreground">
											{isActiveLocal ?
												"Posisi ini sedang aktif dan dapat digunakan"
											:	"Posisi ini nonaktif dan tidak dapat dipilih"}
										</p>
									</div>
									<Switch
										checked={isActiveLocal}
										onCheckedChange={setIsActiveLocal}
										disabled={loading}
										className="data-[state=checked]:bg-green-500"
									/>
								</div>
							</div>

							{/* Footer */}
							<div className="px-6 py-4 border-t flex justify-end gap-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => handleOpenChange(false)}
									disabled={loading}
									className="text-muted-foreground">
									Batal
								</Button>
								<Button
									type="submit"
									size="sm"
									disabled={loading}
									className="gap-1.5 px-4">
									{loading ?
										<LoaderCircle className="w-3.5 h-3.5 animate-spin" />
									:	<Save className="w-3.5 h-3.5" />}
									{loading ? "Menyimpan..." : "Simpan"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditPositionDialog;
