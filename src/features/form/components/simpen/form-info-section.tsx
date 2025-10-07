import React from "react";
import { type Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../schemas/formSchema";
import FormFields from "@/shared/molecules/form-fields";

interface FormInfoSectionProps {
	control: Control<z.infer<typeof formSchema>>;
}

const FormInfoSection: React.FC<FormInfoSectionProps> = ({ control }) => {
	return (
		<FormFields
			fields={[
				{
					name: "title",
					label: "Judul Form",
					type: "text",
					placeholder: "Masukkan judul form",
				},
				{
					name: "description",
					label: "Deskripsi Form",
					type: "text",
					placeholder: "Masukkan deskripsi form",
				},
			]}
			control={control}
		/>
	);
};

export default FormInfoSection;
