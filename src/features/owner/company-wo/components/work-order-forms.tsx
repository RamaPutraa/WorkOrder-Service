import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import { useDialogStore } from "@/store/dialogStore";
import { submitWorkOrderFormApi } from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifySuccess, notifyError } from "@/lib/toast-helper";
import { FileText, Save, XCircle } from "lucide-react";
import { EmptyData } from "@/shared/molecules/empty-data";

interface WorkOrderFormsProps {
	workOrderForm: Form | undefined;
	workOrderId: string;
	submissions: SubmissionObject[];
	isReadOnly?: boolean;
	onSaveSuccess?: () => void;
	isRefreshing?: boolean;
}

const WorkOrderForms = ({
	workOrderForm,
	workOrderId,
	submissions = [],
	isReadOnly = false,
	onSaveSuccess,
	isRefreshing = false,
}: WorkOrderFormsProps) => {
	const { showDialog } = useDialogStore();
	const [isSaving, setIsSaving] = useState(false);

	// State to track form data: Map<fieldOrder, value>
	const [formData, setFormData] = useState<Map<number, AnswerValue>>(new Map());

	// Original form data for change detection
	const [originalFormData, setOriginalFormData] = useState<
		Map<number, AnswerValue>
	>(new Map());

	// Helper function to get the latest submission
	const getLatestSubmission = (
		submissions: SubmissionObject[],
	): SubmissionObject | null => {
		if (!submissions || submissions.length === 0) return null;
		const relevant = submissions.filter((s) => s.formId === workOrderForm?._id);
		if (relevant.length === 0) return null;

		return relevant.reduce((latest, current) =>
			new Date(current.updatedAt) > new Date(latest.updatedAt) ?
				current
			:	latest,
		);
	};

	const draftKey = `wo-form-draft-${workOrderId}-${workOrderForm?._id}`;

	// Initialize form data
	useEffect(() => {
		const fieldMap = new Map<number, AnswerValue>();
		if (!workOrderForm) return;

		const submission = getLatestSubmission(submissions);

		workOrderForm.fields.forEach((field) => {
			let answer: AnswerValue = null;

			if (submission) {
				const submittedData = submission.fieldsData.find(
					(fd) => fd.order === field.order,
				);
				answer = submittedData?.value ?? null;
			}
			fieldMap.set(field.order, answer);
		});

		setOriginalFormData(new Map(fieldMap));

		// Check local storage for drafts
		try {
			const draftStr = localStorage.getItem(draftKey);
			if (draftStr && !isReadOnly) {
				const draftParsed = JSON.parse(draftStr);
				for (const [orderStr, value] of Object.entries(draftParsed)) {
					const order = parseInt(orderStr, 10);
					if (!isNaN(order)) {
						const fieldDef = workOrderForm.fields.find(
							(f) => f.order === order,
						);

						// Abaikan draft null/kosong khusus untuk field gambar.
						// Ini membuat gambar revert ke state database jika user melakukan refresh
						// setelah menghapus gambar tanpa menyimpannya.
						if (fieldDef?.type === "image" && !value) {
							continue;
						}

						fieldMap.set(order, value as AnswerValue);
					}
				}
			}
		} catch (e) {
			console.error("Failed to load form draft", e);
		}

		setFormData(fieldMap);
	}, [workOrderForm, submissions, isReadOnly, draftKey]);

	// Save to local storage whenever formData changes
	useEffect(() => {
		if (isReadOnly || !workOrderForm || formData.size === 0) return;

		let changed = false;
		for (const [order, value] of formData.entries()) {
			const originalValue = originalFormData.get(order);
			if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
				changed = true;
				break;
			}
		}

		if (changed) {
			const draftObj: Record<string, any> = {};
			for (const [order, value] of formData.entries()) {
				const fieldDef = workOrderForm.fields.find((f) => f.order === order);
				if (fieldDef?.type === "image") {
					draftObj[order] = value;
				}
			}
			
			if (Object.keys(draftObj).length > 0) {
				localStorage.setItem(draftKey, JSON.stringify(draftObj));
			} else {
				localStorage.removeItem(draftKey);
			}
		} else {
			localStorage.removeItem(draftKey);
		}
	}, [formData, originalFormData, draftKey, isReadOnly, workOrderForm]);

	// Handle field value change
	const handleFieldChange = (order: number, value: AnswerValue) => {
		setFormData((prev) => {
			const newData = new Map(prev);
			newData.set(order, value);
			return newData;
		});
	};

	// Check if there are changes
	const hasChanges = () => {
		if (formData.size !== originalFormData.size) return true;

		for (const [order, value] of formData.entries()) {
			const originalValue = originalFormData.get(order);
			if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
				return true;
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
				if (!workOrderForm) return;

				const fieldsData = Array.from(formData.entries()).map(
					([order, value]) => ({
						order: order,
						value: value ?? "",
					}),
				);

				const existingSubmission = getLatestSubmission(submissions);

				// Build payload for submissions array
				const submissionToSend: SubmissionObject = {
					_id:
						existingSubmission?._id ??
						`sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
					ownerId: existingSubmission?.ownerId ?? "",
					formId: workOrderForm._id,
					submissionType: "work_order",
					fieldsData,
					status: "submitted",
					submittedBy: existingSubmission?.submittedBy ?? "",
					createdAt: existingSubmission?.createdAt ?? new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				const { error } = await handleApi(() =>
					submitWorkOrderFormApi(workOrderId, submissionToSend),
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

				// Clear draft on success
				localStorage.removeItem(draftKey);

				// Call parent callback to refetch data
				if (onSaveSuccess) {
					onSaveSuccess();
				}
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
				localStorage.removeItem(draftKey);
				setFormData(new Map(originalFormData));
			},
		});
	};

	return (
		<div className="border shadow-sm rounded-xl relative overflow-hidden">
			{isRefreshing && (
				<div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
					<div className="w-8 h-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent mb-2" />
					<p className="text-sm font-semibold text-primary">Memperbarui...</p>
				</div>
			)}
			<div className="p-6 pb-4 border-b border-border/50">
				<div className="flex items-center gap-4">
					<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
						<FileText className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-md font-bold text-foreground leading-tight">
							{workOrderForm?.title || "Formulir Perintah Kerja"}
						</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							{workOrderForm?.description || "—"}
						</p>
					</div>
				</div>
			</div>
			<div className="space-y-4 p-6 pt-4">
				{!workOrderForm ?
					<EmptyData />
				:	<div className="space-y-4">
						{workOrderForm.fields.length > 0 ?
							workOrderForm.fields
								.sort((a, b) => a.order - b.order)
								.map((field, idx) => {
									const answer = formData.get(field.order) ?? null;
									return (
										<div key={field.order}>
											<FormFieldViewer
												field={field}
												answer={answer}
												index={idx + 1}
												readOnly={isReadOnly}
												onChange={(value) =>
													handleFieldChange(field.order, value)
												}
											/>
										</div>
									);
								})
						:	<EmptyData />}
					</div>
				}

				{!isReadOnly && hasChanges() && (
					<div className="flex items-center justify-end border-t mt-6 pt-4 gap-2">
						<Button
							className="bg-white border hover:bg-muted/20 w-full md:w-auto text-black rounded-xl  h-11 shadow-sm shadow-white-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
							onClick={handleCancel}
							disabled={isSaving}>
							<XCircle className="w-4 h-4 mr-2" />
							Batal
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
							onClick={handleSave}
							disabled={isSaving}>
							<Save className="w-4 h-4 mr-2" />
							{isSaving ? "Menyimpan..." : "Simpan"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default WorkOrderForms;
