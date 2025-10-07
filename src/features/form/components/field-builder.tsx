import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { formSchema, type FormSchema } from "../schemas/formSchema";
import { DynamicFields } from "./dyanamic-fields";
import FormFields from "@/shared/molecules/form-fields";
import type { FieldConfig } from "@/types/form";
type Props = { onSubmitForm?: (data: FormSchema) => Promise<void> | void };

export const FormBuilder: React.FC<Props> = ({ onSubmitForm }) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			accessType: "",
			accessibleBy: [],
			allowedPositions: [],
			fields: [],
		},
	});
	const { control, handleSubmit, setValue, reset } = form;
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "fields",
	});
	const staticFields: FieldConfig<FormSchema>[] = [
		{ name: "title", label: "Judul Form", type: "text" },
		{ name: "description", label: "Deskripsi", type: "textarea" },
		{ name: "accessType", label: "Tipe Akses", type: "text" },
	];
	const handleSubmitForm = async (data: FormSchema) => {
		if (onSubmitForm) {
			await onSubmitForm(data);
			return;
		}
		try {
			const res = await fetch("/api/form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.message);
			alert("Form berhasil disimpan!");
			reset();
		} catch (err) {
			console.error(err);
			alert("Terjadi kesalahan saat menyimpan form");
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(handleSubmitForm)}
				className="space-y-6 p-6 bg-background rounded-lg shadow-sm">
				{/* ✅ Static fields */}
				<FormFields fields={staticFields} control={control} />
				<div>
					<label className="">Accessible By (pisahkan koma)</label>
					<input
						className="w-full border rounded px-3 py-2 mt-1"
						onChange={(e) =>
							setValue(
								"accessibleBy",
								e.target.value.split(",").map((s) => s.trim())
							)
						}
					/>
				</div>
				<div>
					<label className="">Allowed Positions (pisahkan koma)</label>
					<input
						className="w-full border rounded px-3 py-2 mt-1"
						onChange={(e) =>
							setValue(
								"allowedPositions",
								e.target.value.split(",").map((s) => s.trim())
							)
						}
					/>
				</div>
				<Separator />
				<DynamicFields
					fields={fields}
					append={append}
					remove={remove}
					update={update}
					control={control}
				/>
				<Separator />
				<Button type="submit" className="w-full">
					Simpan Form
				</Button>
			</form>
		</Form>
	);
};
