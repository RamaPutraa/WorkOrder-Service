import { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicFields } from "./dynamic-fields";
import { createFormApi } from "../../services/formService";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useValidation } from "@/hooks/use-validation";
import { minFields, required, minLength } from "@/lib/validators";
import { useNavigate } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";

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
		const [hasSubmitted, setHasSubmitted] = useState(false);
		const navigate = useNavigate();
		const { formData, setFormData, errors, validateForm, validateAndSetField } =
			useValidation<CreateFormRequest>(
				{
					title: "",
					description: "",
					formType: "",
					fields: [],
				},
				{
					title: [
						required("Judul form harus diisi"),
						minLength(3, "Judul form minimal 3 karakter"),
					],
					description: [required("Deskripsi form harus diisi")],
					formType: [required("Tipe form harus dipilih")],
					fields: [
						minFields(1, "Minimal tambahkan 1 pertanyaan ke dalam form"),
					],
				}
			);
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

			const updatedFields = [...formData.fields, newField];

			// Gunakan validateAndSetField agar auto-clear error fields
			validateAndSetField("fields", updatedFields);

			onFieldsChange?.(updatedFields);
		};

		const handleRemoveField = (index: number) => {
			const updatedFields = formData.fields.filter((_, i) => i !== index);

			validateAndSetField("fields", updatedFields);

			onFieldsChange?.(updatedFields);
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
			setHasSubmitted(true);

			if (!validateForm()) {
				toast.error("Periksa kembali isian form!");
				return;
			}

			setIsSubmitting(true);

			const { data: res, error } = await handleApi(() =>
				createFormApi(formData)
			);

			setIsSubmitting(false);

			if (error) {
				console.error(error);
				notifyError(error.message || "Gagal menyimpan form!");
				return;
			}

			const form = res?.data;
			if (!form) {
				notifyError("Gagal membuat form", "Data posisi tidak ditemukan");
				return;
			}

			notifySuccess("Form berhasil disimpan!");
			navigate("/dashboard/owner/forms");
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
							<Label
								className={`font-medium ${errors.title ? "text-red-500" : ""}`}>
								Judul Form
							</Label>
							<Input
								value={formData.title}
								onChange={(e) => validateAndSetField("title", e.target.value)}
								placeholder="Contoh: Formulir Pendaftaran"
								className={`${
									errors.title
										? "border-red-500 focus-visible:ring-red-300"
										: ""
								}`}
							/>
							{errors.title && (
								<p className="text-sm text-red-500">{errors.title}</p>
							)}
						</div>

						{/* Deskripsi */}
						<div className="space-y-2">
							<Label
								className={`font-medium ${
									errors.description ? "text-red-500" : ""
								}`}>
								Deskripsi
							</Label>
							<Textarea
								value={formData.description}
								onChange={(e) =>
									validateAndSetField("description", e.target.value)
								}
								placeholder="Tuliskan deskripsi singkat form..."
								className={`${
									errors.description
										? "border-red-500 focus-visible:ring-red-300"
										: ""
								}`}
							/>
							{errors.description && (
								<p className="text-sm text-red-500">{errors.description}</p>
							)}
						</div>

						{/* Form Type (Dropdown) */}
						<div className="space-y-2">
							<Label
								className={`font-medium ${
									errors.formType ? "text-red-500" : ""
								}`}>
								Tipe Form
							</Label>
							<Select
								value={formData.formType}
								onValueChange={(value) =>
									validateAndSetField("formType", value)
								}>
								<SelectTrigger
									className={`w-full ${
										errors.formType
											? "border-red-500 focus:ring-red-500 focus:border-red-300"
											: ""
									}`}>
									<SelectValue placeholder="Pilih tipe form" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="work_order">Work Order</SelectItem>
									<SelectItem value="intake_forms">Intake Forms</SelectItem>
									<SelectItem value="report">Laporan</SelectItem>
								</SelectContent>
							</Select>
							{errors.formType && (
								<p className="text-sm text-red-500">{errors.formType}</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Field Dinamis */}
				<DynamicFields
					fields={formData.fields}
					onRemove={handleRemoveField}
					onUpdate={handleUpdateField}
					hasSubmitted={hasSubmitted}
				/>
				{errors.fields && (
					<Card className="rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden relative">
						{/* Garis biru di kiri */}
						<div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-lg" />
						<div className="p-6">
							<p className="text-sm text-red-500 mt-1">{errors.fields}</p>
						</div>
					</Card>
				)}
			</div>
		);
	}
);
