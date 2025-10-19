import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicFields } from "./dynamic-fields";
import { createFormApi } from "../services/formService";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type FormBuilderRef = {
	submitForm: () => void;
	addField: () => void;
	isSubmitting: boolean;
};

type Props = {
	onFieldsChange?: (fields: Field[]) => void;
};

export const FormBuilder = forwardRef<FormBuilderRef, Props>(
	({ onFieldsChange }, ref) => {
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [formData, setFormData] = useState<CreateFormRequest>({
			title: "",
			description: "",
			formType: "",
			fields: [],
		});

		const handleAddField = () => {
			const newField: Field = {
				order: formData.fields.length + 1,
				label: "",
				type: "text",
				required: false,
				placeholder: "",
				min: null,
				max: null,
				options: [],
			};
			setFormData((prev) => {
				const updated = { ...prev, fields: [...prev.fields, newField] };
				onFieldsChange?.(updated.fields);
				return updated;
			});
		};

		const handleRemoveField = (index: number) => {
			setFormData((prev) => {
				const updated = {
					...prev,
					fields: prev.fields.filter((_, i) => i !== index),
				};
				onFieldsChange?.(updated.fields);
				return updated;
			});
		};

		const handleUpdateField = (index: number, updatedField: Partial<Field>) => {
			setFormData((prev) => {
				const newFields = [...prev.fields];
				newFields[index] = { ...newFields[index], ...updatedField };
				const updated = { ...prev, fields: newFields };
				onFieldsChange?.(updated.fields);
				return updated;
			});
		};

		const handleSubmit = async () => {
			setIsSubmitting(true);
			try {
				const res = await createFormApi(formData);
				console.log(res);
				toast.success("Form berhasil disimpan!");
			} catch (error) {
				console.error(error);
				toast.error("Gagal menyimpan form!");
			} finally {
				setIsSubmitting(false);
			}
		};

		useImperativeHandle(ref, () => ({
			submitForm: handleSubmit,
			addField: handleAddField,
			isSubmitting,
		}));

		return (
			<div className="w-full space-y-6 pb-10">
				<Card className="rounded-2xl shadow-sm border border-gray-200">
					<CardContent className="p-6 space-y-5">
						{/* Judul Form */}
						<div className="space-y-2">
							<Label className="text-base font-medium">Judul Form</Label>
							<Input
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="Contoh: Formulir Pendaftaran"
							/>
						</div>

						{/* Deskripsi */}
						<div className="space-y-2">
							<Label>Deskripsi</Label>
							<Textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="Tuliskan deskripsi singkat form..."
							/>
						</div>

						{/* Form Type (Dropdown) */}
						<div className="space-y-2">
							<Label>Tipe Form</Label>
							<Select
								value={formData.formType}
								onValueChange={(value) =>
									setFormData({ ...formData, formType: value })
								}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Pilih tipe form" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="work_order">Work Order</SelectItem>
									<SelectItem value="report">Laporan</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Field Dinamis */}
				<DynamicFields
					fields={formData.fields}
					onRemove={handleRemoveField}
					onUpdate={handleUpdateField}
				/>
			</div>
		);
	}
);
