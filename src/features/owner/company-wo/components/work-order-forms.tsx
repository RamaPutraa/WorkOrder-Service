import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDialogStore } from "@/store/dialogStore";
import { submitWorkOrderFormApi } from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifySuccess, notifyError } from "@/lib/toast-helper";
import { Pencil } from "lucide-react";

interface WorkOrderFormsProps {
	workorderForms: WorkOrderFormItem[];
	workOrderId: string;
	submissions: PublicSubmission[];
}

const WorkOrderForms = ({
	workorderForms,
	workOrderId,
	submissions,
}: WorkOrderFormsProps) => {
	const { showDialog } = useDialogStore();
	const [isSaving, setIsSaving] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// State to track form data: Map<formId, Map<fieldOrder, value>>
	const [formData, setFormData] = useState<
		Map<string, Map<number, AnswerValue>>
	>(new Map());

	// Original form data for change detection
	const [originalFormData, setOriginalFormData] = useState<
		Map<string, Map<number, AnswerValue>>
	>(new Map());

	// Initialize form data from workorderForms or submissions
	useEffect(() => {
		const initialData = new Map<string, Map<number, AnswerValue>>();

		workorderForms.forEach((woForm) => {
			const fieldMap = new Map<number, AnswerValue>();

			// Check if there's a submission for this form
			const submission = submissions.find(
				(sub) => sub.formId === woForm.form._id,
			);

			woForm.form.fields.forEach((field) => {
				let answer: AnswerValue = null;

				// Prioritize data from submission if it exists
				if (submission) {
					const submittedData = submission.fieldsData.find(
						(fd) => fd.order === field.order,
					);
					answer = submittedData?.value ?? null;
				} else {
					// Fallback to fieldsData from woForm
					answer =
						woForm.fieldsData?.find((fd) => fd.order === field.order)?.value ??
						null;
				}

				fieldMap.set(field.order, answer);
			});

			initialData.set(woForm.form._id, fieldMap);
		});

		setFormData(initialData);
		setOriginalFormData(new Map(initialData));
	}, [workorderForms, submissions]);

	// Handle field value change
	const handleFieldChange = (
		formId: string,
		order: number,
		value: AnswerValue,
	) => {
		setFormData((prev) => {
			const newData = new Map(prev);
			const fieldMap = new Map(newData.get(formId) || new Map());
			fieldMap.set(order, value);
			newData.set(formId, fieldMap);
			return newData;
		});
	};

	// Check if there are changes
	const hasChanges = () => {
		if (formData.size !== originalFormData.size) return true;

		for (const [formId, fieldMap] of formData.entries()) {
			const originalFieldMap = originalFormData.get(formId);
			if (!originalFieldMap) return true;

			if (fieldMap.size !== originalFieldMap.size) return true;

			for (const [order, value] of fieldMap.entries()) {
				const originalValue = originalFieldMap.get(order);
				if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
					return true;
				}
			}
		}

		return false;
	};

	// Handle save with confirmation
	const handleSave = () => {
		showDialog({
			title: "Konfirmasi Simpan",
			description:
				"Apakah Anda yakin ingin menyimpan perubahan formulir perintah kerja?",
			confirmText: "Simpan",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSaving(true);

				// Build submissions array - only include forms that have been filled
				const submissions: PublicSubmission[] = workorderForms
					.map((woForm) => {
						const fieldMap = formData.get(woForm.form._id) || new Map();
						const fieldsData: FieldData[] = Array.from(fieldMap.entries()).map(
							([order, value]) => ({
								order: order, // Keep as number
								value: value ?? "",
							}),
						);

						// Check if form has any filled fields (not null/empty)
						const hasFilledFields = Array.from(fieldMap.values()).some(
							(value) => {
								if (value === null || value === undefined) return false;
								if (typeof value === "string" && value.trim() === "")
									return false;
								if (Array.isArray(value) && value.length === 0) return false;
								return true;
							},
						);

						// Only return submission if form has filled fields
						if (!hasFilledFields) return null;

						return {
							_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
							ownerId: "", // Will be set by backend
							formId: woForm.form._id,
							submissionType: "work_order",
							fieldsData,
							status: "submitted",
							submittedBy: "", // Will be set by backend
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						};
					})
					.filter((sub): sub is PublicSubmission => sub !== null); // Remove null entries

				const { error } = await handleApi(() =>
					submitWorkOrderFormApi(workOrderId, submissions),
				);

				setIsSaving(false);

				if (error) {
					notifyError("Gagal menyimpan", error.message);
					return;
				}

				notifySuccess(
					"Berhasil disimpan",
					"Formulir perintah kerja telah disimpan",
				);

				// Reload page to get updated data
				setTimeout(() => {
					window.location.reload();
				}, 1000); // Delay 1 detik agar toast notification terlihat
			},
		});
	};

	// Handle cancel with confirmation
	const handleCancel = () => {
		showDialog({
			title: "Konfirmasi Batal",
			description:
				"Apakah Anda yakin ingin membatalkan perubahan? Semua perubahan yang belum disimpan akan hilang.",
			confirmText: "Ya, Batalkan",
			cancelText: "Tidak",
			onConfirm: () => {
				setFormData(new Map(originalFormData));
				if (isEditMode) {
					setIsEditMode(false);
				}
			},
		});
	};

	// Handle enter edit mode
	const handleEnterEditMode = () => {
		setIsEditMode(true);
	};

	return (
		<Tabs defaultValue="workorder">
			<TabsList>
				<TabsTrigger value="workorder">Perintah Kerja</TabsTrigger>
				<TabsTrigger value="report">Laporan Perintah Kerja</TabsTrigger>
			</TabsList>

			{/* TAB: PERINTAH KERJA */}
			<TabsContent value="workorder">
				<Card className="border rounded-xl shadow-sm mt-6">
					<CardHeader>
						<h2 className="text-lg font-semibold">Formulir Perintah Kerja</h2>
						<p className="text-sm text-muted-foreground">
							Formulir ini merupakan formulir perintah kerja untuk internal
							perusahaan
						</p>
					</CardHeader>

					<div className="content p-6">
						{workorderForms.map((woForm, index) => (
							<div key={index} className="mb-8">
								<h2 className="text-lg font-semibold">{woForm.form?.title}</h2>
								<p className="text-sm text-muted-foreground">
									{woForm.form?.description}
								</p>
								<div className="mt-4 space-y-4">
									{woForm.form.fields
										.sort((a, b) => a.order - b.order)
										.map((field) => {
											const fieldMap = formData.get(woForm.form._id);
											const answer = fieldMap?.get(field.order) ?? null;

											return (
												<Card
													key={field.order}
													className="shadow-sm border rounded-lg p-4 bg-white">
													<FormFieldViewer
														field={field}
														answer={answer}
														onChange={(value) =>
															handleFieldChange(
																woForm.form._id,
																field.order,
																value,
															)
														}
													/>
												</Card>
											);
										})}
								</div>
							</div>
						))}
					</div>

					{/* Tombol Simpan dan Batal - hanya muncul jika ada perubahan */}
					{hasChanges() && (
						<div className="flex items-center justify-end border-t-2 mx-5">
							<div className="flex items-center gap-2 pt-5 pb-3">
								<Button
									variant="outline"
									onClick={handleCancel}
									disabled={isSaving}>
									Batal
								</Button>
								<Button onClick={handleSave} disabled={isSaving}>
									{isSaving ? "Menyimpan..." : "Simpan"}
								</Button>
							</div>
						</div>
					)}
				</Card>
			</TabsContent>

			{/* TAB: LAPORAN PERINTAH KERJA */}
			<TabsContent value="report">
				<Card className="border rounded-xl shadow-sm mt-6">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-semibold">
									Formulir Laporan Perintah Kerja
								</h2>
								<p className="text-sm text-muted-foreground">
									Formulir ini merupakan laporan dari perintah kerja
								</p>
							</div>
							{!isEditMode && submissions.length > 0 && (
								<Button
									onClick={handleEnterEditMode}
									variant="outline"
									size="sm"
									className="gap-2">
									<Pencil className="w-4 h-4" />
									Edit
								</Button>
							)}
						</div>
						{isEditMode && (
							<div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
								</svg>
								<div>
									<p className="text-sm font-medium text-amber-900">
										📝 Mode Edit Aktif
									</p>
									<p className="text-xs text-amber-700 mt-0.5">
										Anda dapat mengedit form. Klik Simpan untuk menyimpan
										perubahan atau Batal untuk membatalkan.
									</p>
								</div>
							</div>
						)}
					</CardHeader>

					<CardContent className="space-y-6">
						{submissions.length === 0 ?
							<div className="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/30 hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition min-h-[160px]">
								<p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition">
									Perintah kerja belum dikerjakan
								</p>
							</div>
						:	submissions.map((submission) => {
								// Find the corresponding form
								const woForm = workorderForms.find(
									(wf) => wf.form._id === submission.formId,
								);

								if (!woForm) return null;

								return (
									<div key={submission._id} className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-semibold">
													{woForm.form?.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{woForm.form?.description}
												</p>
											</div>
											<div className="text-right">
												<p className="text-xs text-muted-foreground">
													Dikirim pada:
												</p>
												<p className="text-sm font-medium">
													{new Date(submission.createdAt).toLocaleDateString(
														"id-ID",
														{
															day: "2-digit",
															month: "long",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</p>
											</div>
										</div>

										<div className="space-y-4">
											{woForm.form.fields
												.sort((a, b) => a.order - b.order)
												.map((field) => {
													const fieldData = submission.fieldsData.find(
														(fd) => fd.order === field.order,
													);

													// Get current value from formData if in edit mode
													const fieldMap = formData.get(woForm.form._id);
													const currentValue =
														isEditMode ?
															(fieldMap?.get(field.order) ??
															fieldData?.value ??
															null)
														:	(fieldData?.value ?? null);

													return (
														<Card
															key={field.order}
															className="shadow-sm border rounded-lg p-4 bg-white">
															<FormFieldViewer
																field={field}
																answer={currentValue}
																readOnly={!isEditMode}
																onChange={
																	isEditMode ?
																		(value) =>
																			handleFieldChange(
																				woForm.form._id,
																				field.order,
																				value,
																			)
																	:	undefined
																}
															/>
														</Card>
													);
												})}
										</div>
									</div>
								);
							})
						}
					</CardContent>

					{/* Tombol Simpan dan Batal - muncul saat edit mode dan ada perubahan */}
					{isEditMode && hasChanges() && (
						<div className="flex items-center justify-end border-t-2 mx-5">
							<div className="flex items-center gap-2 pt-5 pb-3">
								<Button
									variant="outline"
									onClick={handleCancel}
									disabled={isSaving}>
									Batal
								</Button>
								<Button onClick={handleSave} disabled={isSaving}>
									{isSaving ? "Menyimpan..." : "Simpan"}
								</Button>
							</div>
						</div>
					)}
				</Card>
			</TabsContent>
		</Tabs>
	);
};

export default WorkOrderForms;
