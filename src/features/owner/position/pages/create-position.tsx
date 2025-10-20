import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Plus } from "lucide-react";
import usePosition from "../hooks/usePosition";
import { useForm } from "react-hook-form";
import { positionSchema } from "../schemas/positionSchema";
import FormFields from "@/shared/molecules/form-fields";
import z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreatePosition: React.FC = () => {
	const navigate = useNavigate();
	const { createPosition, loading } = usePosition();
	const form = useForm<z.infer<typeof positionSchema>>({
		resolver: zodResolver(positionSchema),
		defaultValues: {
			name: "",
		},
	});

	const positionsFields: FieldConfig[] = [
		{
			name: "name",
			label: "Nama Posisi",
			type: "text",
			placeholder: "Contoh: Manager, Staff, dll",
		},
	];

	const onSubmit = (data: z.infer<typeof positionSchema>) =>
		createPosition(data);

	return (
		<Card className="p-4 border shadow-md rounded-2xl ">
			<div className="container py-10 px-6">
				<div className="flex items-center justify-between mb-8">
					<div className="flex flex-col space-y-2">
						<h1 className="text-xl font-bold tracking-tight">
							Tambah Data Posisi Pegawai
						</h1>
						<p className="text-muted-foreground">
							Berikut merupakan form tambah posisi pegawai yang dimiliki oleh
							perusahaan.
						</p>
					</div>
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90">
						<ArrowLeft className="h-4 w-4" />
						Kembali
					</Button>
				</div>

				<Form {...form}>
					<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
						<FormFields fields={positionsFields} control={form.control} />

						<Button
							type="submit"
							className="w-4xs p-4 bg-primary mt-3"
							disabled={loading}>
							{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
							<Plus className="h-4 w-4" />
							Simpan Posisi
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};
export default CreatePosition;
