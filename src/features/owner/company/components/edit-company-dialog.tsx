import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogHeader,
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
import { Building2, MapPin, FileText, Save, LoaderCircle } from "lucide-react";
import { useUpdateCompany } from "../hooks/companyHooks";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";
import { useState } from "react";

// ─── Schema ──────────────────────────────────────────────────────────────────
const editCompanySchema = z.object({
	name: z.string().min(3, "Nama minimal 3 karakter"),
	address: z.string().min(5, "Alamat minimal 5 karakter"),
	description: z.string().optional(),
});

type EditCompanyFormValues = z.infer<typeof editCompanySchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface EditCompanyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	company: Company;
	onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const EditCompanyDialog = ({
	open,
	onOpenChange,
	company,
	onSuccess,
}: EditCompanyDialogProps) => {
	const [showConfirmClose, setShowConfirmClose] = useState(false);

	const { updateCompany, loading } = useUpdateCompany(() => {
		onOpenChange(false);
		onSuccess();
	});

	const form = useForm<EditCompanyFormValues>({
		resolver: zodResolver(editCompanySchema),
		defaultValues: {
			name: company.name,
			address: company.address ?? "",
			description: company.description ?? "",
		},
	});

	// Reset form setiap kali dialog dibuka dengan data company terbaru
	useEffect(() => {
		if (open) {
			form.reset({
				name: company.name,
				address: company.address ?? "",
				description: company.description ?? "",
			});
			setShowConfirmClose(false);
		}
	}, [open, company]);

	const { isDirty, isSubmitSuccessful } = form.formState;
	const hasUnsavedChanges = isDirty && !isSubmitSuccessful;

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && hasUnsavedChanges) {
			setShowConfirmClose(true);
		} else {
			onOpenChange(newOpen);
		}
	};

	const onSubmit = async (values: EditCompanyFormValues) => {
		await updateCompany({
			name: values.name,
			address: values.address,
			description: values.description ?? "",
			isActive: company.isActive,
		});
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
				<DialogContent className="sm:max-w-[460px] max-h-[90vh] flex flex-col rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
					{/* Header */}
					<div className="shrink-0 bg-gradient-to-b from-primary to-primary/70 p-6 text-white relative">
						<DialogHeader className="relative z-10">
							<DialogTitle className="flex items-center gap-3 text-white text-xl">
								<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
									<Building2 className="w-6 h-6" />
								</div>
								<span>Edit Perusahaan</span>
							</DialogTitle>
							<DialogDescription className="text-white/90 mt-2 text-sm font-medium opacity-90">
								Perbarui informasi dasar perusahaan Anda
							</DialogDescription>
						</DialogHeader>
					</div>

					{/* Form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden bg-white">
							<div className="flex-1 overflow-y-auto px-6 pt-5 pb-6 space-y-4">
								{/* Nama */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground">
												Nama Perusahaan
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
													<Input
														placeholder="Nama perusahaan"
														className="pl-8 h-9 rounded-lg text-sm"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-xs" />
										</FormItem>
									)}
								/>

								{/* Alamat */}
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground">
												Alamat
											</FormLabel>
											<FormControl>
												<div className="relative">
													<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
													<Input
														placeholder="Alamat perusahaan"
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
												Deskripsi{" "}
												<span className="text-muted-foreground/60">
													(opsional)
												</span>
											</FormLabel>
											<FormControl>
												<div className="relative">
													<FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
													<Textarea
														placeholder="Deskripsi singkat tentang perusahaan..."
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

							{/* Footer */}
							<div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => handleOpenChange(false)}
									disabled={loading}
									className="text-slate-500 rounded-xl hover:bg-slate-50 cursor-pointer">
									Batal
								</Button>
								<Button
									type="submit"
									size="sm"
									disabled={loading}
									className="gap-1.5 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all cursor-pointer">
									{loading ?
										<LoaderCircle className="w-3.5 h-3.5 animate-spin" />
										: <Save className="w-3.5 h-3.5" />}
									{loading ? "Menyimpan..." : "Simpan Perubahan"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditCompanyDialog;
