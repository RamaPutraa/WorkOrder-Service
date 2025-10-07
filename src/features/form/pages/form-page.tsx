import React from "react";
import { FormBuilder } from "../components/field-builder";
import type { FormSchema } from "../schemas/formSchema";
const FormCreatePage: React.FC = () => {
	const handleCreateForm = async (data: FormSchema) => {
		console.log("Form data:", data);
	};
	return (
		<div className="container py-8 space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-2xl font-bold">Buat Form Baru</h1>
				<p className="text-muted-foreground">
					Lengkapi detail form dan tambahkan field secara dinamis di bawah.
				</p>
			</div>
			<FormBuilder onSubmitForm={handleCreateForm} />
		</div>
	);
};
export default FormCreatePage;
