import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import usePosition from "../hooks/usePosition";
import { useForm } from "react-hook-form";
import { positionSchema } from "../schemas/positionSchema";
import FormFields from "@/shared/molecules/form-fields";
import z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonLoading } from "@/shared/atoms";

const CreatePosition: React.FC = () => {
	const navigate = useNavigate();
	const { createPosition, loading } = usePosition();
	const form = useForm<z.infer<typeof positionSchema>>({
		resolver: zodResolver(positionSchema),
		defaultValues: {
			name: "",
			description: "",
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
			placeholder: "Deskripsi departemen",
		},
	];

	const onSubmit = (data: z.infer<typeof positionSchema>) =>
		createPosition(data);

	return (
		<Card className="p-4 border shadow-md rounded-2xl ">
			<div className="container py-10 px-6">
				<div className="flex items-center gap-4 mb-8">
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full shrink-0">
						<ChevronLeft className="size-6" />
					</Button>
					<div className="flex-1">
						<h1 className="text-2xl font-bold">Tambah Data Departemen</h1>
						<p className="text-muted-foreground text-sm mt-0.5">
							Berikut merupakan form tambah departemen yang dimiliki oleh
							perusahaan.
						</p>
					</div>
				</div>

				<Form {...form}>
					<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
						<FormFields fields={positionsFields} control={form.control} />

						<Button
							type="submit"
							className="w-4xs p-4 bg-primary mt-3"
							disabled={loading}>
							{loading ?
								<ButtonLoading />
							:	<Plus className="h-4 w-4" />}
							Simpan Departemen
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};
export default CreatePosition;
