import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Briefcase, FileText, Save, LoaderCircle } from "lucide-react";
import usePosition from "../hooks/usePosition";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";

// ─── Schema ───────────────────────────────────────────────────────────────────
const editPositionSchema = z.object({
	name: z.string().min(1, "Nama departemen wajib diisi"),
	description: z.string().min(1, "Deskripsi departemen wajib diisi"),
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
	const [showConfirmClose, setShowConfirmClose] = useState(false);

	const { updatePosition, loading } = usePosition(() => {
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
			setShowConfirmClose(false);
		}
	}, [open, position]);

	// ── Form submit ────────────────────────────────────────────────────────────
	const onSubmit = async (values: EditPositionFormValues) => {
		await updatePosition(position._id, {
			name: values.name,
			description: values.description,
			isActive: true,
		});
	};

	const { isDirty: isFormDirty, isSubmitSuccessful } = form.formState;

	const hasUnsavedChanges =
		isFormDirty && !isSubmitSuccessful;

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
				<DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
					{/* Header - Matching Latest Design */}
					<div className="bg-gradient-to-b from-primary to-primary/70 p-4 text-white relative">
						<div className="relative z-10 flex flex-col gap-1">
							<div className="flex items-center gap-3 text-white text-md">
								<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
									<Briefcase className="w-5 h-5" />
								</div>
								<div>
									<span className="font-bold">Edit Departemen</span>
									<div className="text-white/80 text-[12px] font-medium ">
										Perbarui informasi departemen atau departemen operasional.
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Form Body */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="px-6 pt-5 pb-2 space-y-4 bg-white">
								{/* Nama */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground ml-1">
												Nama Departemen
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
													<Input
														placeholder="Nama departemen"
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
											<FormLabel className="text-xs font-medium text-muted-foreground ml-1">
												Deskripsi
											</FormLabel>
											<FormControl>
												<div className="relative">
													<FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
													<Textarea
														placeholder="Jelaskan tanggung jawab departemen ini..."
														className="pl-8 min-h-[80px] rounded-lg text-sm resize-none"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>


							</div>
							{/* Footer Actions */}
							<div className="px-6 pb-6 pt-4 bg-white border-t border-border/50">
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
										:	<Save className="w-4 h-4" />}
										{loading ? "Menyimpan..." : "Simpan Perubahan"}
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

export default EditPositionDialog;
