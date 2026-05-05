import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket, Loader2, Save } from "lucide-react";
import { useCreateMembercode } from "../hooks/useCreateMembercode";
import { useForm } from "react-hook-form";
import { membercodeSchema } from "../schemas/membercodeSchema";
import FormFields from "@/shared/molecules/form-fields";
import z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/shared/atoms/header-content";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";

const CreateMembercode: React.FC = () => {
	const { createMembercode, loading } = useCreateMembercode();
	const form = useForm<z.infer<typeof membercodeSchema>>({
		resolver: zodResolver(membercodeSchema) as any,
		defaultValues: {
			prefix: "",
			amount: 1,
		},
	});

	const membercodeFields: FieldConfig[] = [
		{
			name: "prefix",
			label: "Prefix / Kode Awalan",
			type: "text",
			placeholder: "Contoh: VIP, PROMO, MHS",
		},
		{
			name: "amount",
			label: "Jumlah Kode",
			type: "number",
			placeholder: "Maksimal 100",
		},
	];

	const onSubmit = async (data: z.infer<typeof membercodeSchema>) => {
		await createMembercode(data);
	};

	const { isDirty, isSubmitSuccessful } = form.formState;

	return (
		<>
			<ConfirmLeaveDialog isDirty={isDirty && !isSubmitSuccessful} />
			<PageHeader
				title="Tambah Kode Berlangganan"
				subtitle="Buat kumpulan kode berlangganan (batch) baru yang siap didistribusikan."
				backPath={true}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left — Context Panel */}
				<Card className="lg:col-span-1 border shadow-sm rounded-2xl h-max">
					<CardContent className="p-6 flex flex-col gap-5">
						<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
							<Ticket className="w-7 h-7 text-primary" />
						</div>
						<div className="space-y-1">
							<h3 className="font-semibold text-base">Detail Generator</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Pembuatan massal akan meng-generate serangkaian kode
								berlangganan unik dengan awalan (prefix) yang Anda tentukan.
								Kode-kode ini belum aktif/terklaim hingga didistribusikan ke
								klien tujuan.
							</p>
						</div>

						<Separator />

						<div className="space-y-2">
							<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Aturan Prefix
							</p>
							<ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
								<li>Maksimal 10 Karakter</li>
								<li>Hanya huruf abjad dan angka</li>
								<li>Huruf akan dikonversi otomatis ke kapital</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Right — Form */}
				<Card className="lg:col-span-2 border shadow-md rounded-2xl">
					<CardContent className="p-6 sm:p-8">
						<Form {...form}>
							<form
								className="space-y-6"
								onSubmit={form.handleSubmit(onSubmit as any)}>
								<FormFields
									fields={membercodeFields}
									control={form.control as any}
								/>

								<Separator />

								<div className="flex justify-end pt-2">
									<Button
										type="submit"
										className="gap-2 min-w-[140px] h-10 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
										disabled={loading}>
										{loading ?
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Memproses...
											</>
										:	<>
												<Save className="w-4 h-4" />
												Generate Kode
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

export default CreateMembercode;
