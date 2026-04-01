import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicFields } from "./dynamic-fields";
import { updateFormApi } from "../../services/formService";
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
import { AlertCircle, FileText } from "lucide-react";
import { ConfirmLeaveDialog } from "@/shared/molecules/confirm-leave-dialog";
import { useFormStore } from "@/store/formStore";

export type FormBuilderEditRef = {
	submitForm: () => void;
	addField: () => void;
	isSubmitting: boolean;
};

type Props = {
	formId: string;
	initialData: CreateFormRequest;
	onFieldsChange?: (fields: Field[]) => void;
	onSubmittingChange?: (isSubmitting: boolean) => void;
};

export const FormBuilderEdit = forwardRef<FormBuilderEditRef, Props>(
	({ formId, initialData, onFieldsChange, onSubmittingChange }, ref) => {
		const store = useFormStore();
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [hasSubmitted, setHasSubmitted] = useState(false);
		const [isSuccess, setIsSuccess] = useState(false);
		const navigate = useNavigate();
		const { formData, setFormData, errors, validateForm, validateAndSetField } =
			useValidation<CreateFormRequest>(
				initialData,
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
				},
			);

		// Notify parent whenever fields change
		useEffect(() => {
			onFieldsChange?.(formData.fields);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [formData.fields]);

		// Sync isSubmitting to parent
		useEffect(() => {
			onSubmittingChange?.(isSubmitting);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isSubmitting]);

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
			validateAndSetField("fields", updatedFields);
		};

		const handleRemoveField = (index: number) => {
			const updatedFields = formData.fields.filter((_, i) => i !== index);
			validateAndSetField("fields", updatedFields);
		};

		const handleUpdateField = (index: number, updatedField: Partial<Field>) => {
			setFormData((prev) => {
				const newFields = [...prev.fields];
				newFields[index] = { ...newFields[index], ...updatedField };
				return { ...prev, fields: newFields };
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
				updateFormApi(formId, formData),
			);
			setIsSubmitting(false);
			if (error) {
				notifyError(error.message || "Gagal memperbarui form!");
				return;
			}
			if (!res?.data) {
				notifyError("Gagal memperbarui form", "Data tidak ditemukan");
				return;
			}
			notifySuccess("Form berhasil diperbarui!");
			setIsSuccess(true);
			// Invalidate list cache, lalu set detail cache dengan data terbaru
			// supaya saat navigate(-1) ke detail page, data langsung tersedia tanpa loading
			store.clearCache();
			store.setDetailForm(formId, res.data);
			navigate(-1);
		};

		useImperativeHandle(ref, () => ({
			submitForm: handleSubmit,
			addField: handleAddField,
			isSubmitting,
		}));

		const isDirty = !isSuccess;

		return (
			<div className="w-full space-y-6">
				<ConfirmLeaveDialog isDirty={isDirty} />
				{/* Info Card */}
				<Card className="rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden py-0">
					{/* Card header strip */}
					<div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-br from-background to-muted/20">
						<div className="flex items-center gap-2.5">
							<div className="shrink-0 p-2 rounded-lg bg-primary/5 text-primary">
								<FileText className="w-4 h-4" />
							</div>
							<div>
								<h2 className="text-sm font-semibold text-slate-800">
									Informasi Formulir
								</h2>
								<p className="text-xs text-muted-foreground">
									Perbarui detail dasar formulir Anda
								</p>
							</div>
						</div>
					</div>

					<CardContent className="p-5 sm:p-6 space-y-5">
						{/* Judul Form */}
						<div className="space-y-1.5">
							<Label
								className={`text-sm font-medium ${errors.title ? "text-red-500" : "text-slate-700"}`}>
								Judul Form
								<span className="text-red-400 ml-0.5">*</span>
							</Label>
							<Input
								value={formData.title}
								onChange={(e) => validateAndSetField("title", e.target.value)}
								placeholder="Contoh: Formulir Pendaftaran"
								className={`h-10 rounded-lg ${
									errors.title ?
										"border-red-400 focus-visible:ring-red-300"
									:	"focus-visible:ring-primary/30"
								}`}
							/>
							{errors.title && (
								<p className="text-xs text-red-500 flex items-center gap-1">
									<AlertCircle className="w-3 h-3 shrink-0" />
									{errors.title}
								</p>
							)}
						</div>

						{/* Deskripsi */}
						<div className="space-y-1.5">
							<Label
								className={`text-sm font-medium ${errors.description ? "text-red-500" : "text-slate-700"}`}>
								Deskripsi
								<span className="text-red-400 ml-0.5">*</span>
							</Label>
							<Textarea
								value={formData.description}
								onChange={(e) =>
									validateAndSetField("description", e.target.value)
								}
								placeholder="Tuliskan deskripsi singkat form ini..."
								rows={3}
								className={`rounded-lg resize-none ${
									errors.description ?
										"border-red-400 focus-visible:ring-red-300"
									:	"focus-visible:ring-primary/30"
								}`}
							/>
							{errors.description && (
								<p className="text-xs text-red-500 flex items-center gap-1">
									<AlertCircle className="w-3 h-3 shrink-0" />
									{errors.description}
								</p>
							)}
						</div>

						{/* Tipe Form */}
						<div className="space-y-1.5">
							<Label
								className={`text-sm font-medium ${errors.formType ? "text-red-500" : "text-slate-700"}`}>
								Tipe Form
								<span className="text-red-400 ml-0.5">*</span>
							</Label>
							<Select
								value={formData.formType}
								onValueChange={(value) =>
									validateAndSetField("formType", value)
								}>
								<SelectTrigger
									className={`h-10 rounded-lg w-full ${
										errors.formType ?
											"border-red-400 focus:ring-red-300"
										:	"focus:ring-primary/30"
									}`}>
									<SelectValue placeholder="Pilih tipe form" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="work_order">Perintah Kerja</SelectItem>
									<SelectItem value="intake">Pelanggan</SelectItem>
									<SelectItem value="report">Laporan</SelectItem>
								</SelectContent>
							</Select>
							{errors.formType && (
								<p className="text-xs text-red-500 flex items-center gap-1">
									<AlertCircle className="w-3 h-3 shrink-0" />
									{errors.formType}
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Dynamic Field List */}
				<DynamicFields
					fields={formData.fields}
					onRemove={handleRemoveField}
					onUpdate={handleUpdateField}
					hasSubmitted={hasSubmitted}
				/>

				{/* Global field error */}
				{errors.fields && (
					<div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600">
						<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
						<p className="text-sm">{errors.fields}</p>
					</div>
				)}
			</div>
		);
	},
);
