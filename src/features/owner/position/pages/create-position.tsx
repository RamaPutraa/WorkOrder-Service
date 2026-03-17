import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Loader2, Save } from "lucide-react";
import usePosition from "../hooks/usePosition";
import { useForm } from "react-hook-form";
import { positionSchema } from "../schemas/positionSchema";
import FormFields from "@/shared/molecules/form-fields";
import z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/shared/atoms/header-content";
import { Switch } from "@/components/ui/switch";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";

const CreatePosition: React.FC = () => {
	const { createPosition, loading } = usePosition();
	const form = useForm<z.infer<typeof positionSchema>>({
		resolver: zodResolver(positionSchema),
		defaultValues: {
			name: "",
			description: "",
			isActive: true,
		},
	});

	const positionsFields: FieldConfig[] = [
		{
			name: "name",
			label: "Nama Departemen",
			type: "text",
			placeholder: "Contoh: Manager, Staff, dll",
		},
		{
			name: "description",
			label: "Deskripsi Departemen",
			type: "text",
			placeholder: "Tuliskan deskripsi singkat departemen ini",
		},
	];

	const onSubmit = async (data: z.infer<typeof positionSchema>) => {
		await createPosition(data);
	};

	const { isDirty, isSubmitSuccessful } = form.formState;

	return (
		<>
			<ConfirmLeaveDialog isDirty={isDirty && !isSubmitSuccessful} />
			<PageHeader
				title="Tambah Departemen"
				subtitle="Lengkapi informasi departemen yang akan ditambahkan ke sistem."
				backPath={true}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left — Context Panel */}
				<Card className="lg:col-span-1 border shadow-sm rounded-2xl bg-muted/30">
					<CardContent className="p-6 flex flex-col gap-5">
						<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
							<Building2 className="w-7 h-7 text-primary" />
						</div>
						<div className="space-y-1">
							<h3 className="font-semibold text-base">Informasi Departemen</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Departemen digunakan untuk mengelompokkan posisi dan staf dalam
								organisasi. Pastikan nama dan deskripsi jelas agar mudah
								dipahami.
							</p>
						</div>

						<Separator />

						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Keterangan Status
							</p>
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
									Aktif
								</Badge>
								<p className="text-xs text-muted-foreground">
									Departemen akan tersedia dan dapat digunakan.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
									Tidak Aktif
								</Badge>
								<p className="text-xs text-muted-foreground">
									Departemen disimpan namun tidak dapat bertugas.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Right — Form */}
				<Card className="lg:col-span-2 border shadow-md rounded-2xl">
					<CardContent className="p-6 sm:p-8">
						<Form {...form}>
							<form
								className="space-y-6"
								onSubmit={form.handleSubmit(onSubmit)}>
								<FormFields fields={positionsFields} control={form.control} />

								<Separator />

								{/* isActive Switch */}
								<FormField
									control={form.control}
									name="isActive"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-xl border bg-muted/20 px-5 py-4">
											<div className="space-y-0.5">
												<FormLabel className="text-sm font-semibold">
													Status Aktif
												</FormLabel>
												<FormDescription className="text-xs text-muted-foreground">
													Aktifkan agar departemen ini dapat digunakan dalam
													sistem.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<div className="flex justify-end pt-2">
									<Button
										type="submit"
										className="gap-2 min-w-[140px] h-10 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
										disabled={loading}>
										{loading ?
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Menyimpan...
											</>
										:	<>
												<Save className="w-4 h-4" />
												Simpan Departemen
											</>
										}
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default CreatePosition;
