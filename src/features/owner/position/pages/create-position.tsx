import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import usePosition from "../hooks/usePosition";
import { useForm } from "react-hook-form";
import { positionSchema } from "../schemas/positionSchema";
import FormFields from "@/shared/molecules/form-fields";
import z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";

const CreatePosition: React.FC = () => {
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
		<>
			<PageHeader
				title="Tambah Departemen"
				subtitle="Berikut merupakan form tambah departemen yang dimiliki oleh perusahaan."
				backPath={true}
			/>

			<Card className="p-4 border shadow-md rounded-2xl ">
				<div className="container py-10 px-6">
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
		</>
	);
};
export default CreatePosition;
