// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useNavigate, useParams } from "react-router-dom";
// import {
// 	FileText,
// 	Calendar,
// 	CheckCircle,
// 	Clock,
// 	XCircle,
// 	Pencil,
// } from "lucide-react";
// import { SectionLoading } from "@/shared/atoms";
// import { useEffect, useState } from "react";
// import { handleApi } from "@/lib/handle-api";
// import {
// 	getWorkOrderReport,
// 	submitWorkOrderReportApi,
// } from "../services/company-wo-service";
// import { notifyError, notifySuccess } from "@/lib/toast-helper";
// import FormFieldViewer, {
// 	type AnswerValue,
// } from "@/shared/molecules/form-field-viewer";
// import { useDialogStore } from "@/store/dialogStore";
// import PageHeader from "@/shared/atoms/header-content";

// const CompanyReportWo = () => {
// 	const navigate = useNavigate();
// 	const { id } = useParams<{ id: string }>();
// 	const { showDialog } = useDialogStore();
// 	const [reportData, setReportData] = useState<WorkOrderReport | null>(null);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const [isSaving, setIsSaving] = useState(false);
// 	const [isEditMode, setIsEditMode] = useState(false);

// 	// State to track form data: Map<formId, Map<fieldOrder, value>>
// 	const [formData, setFormData] = useState<
// 		Map<string, Map<number, AnswerValue>>
// 	>(new Map());
// 	const [originalFormData, setOriginalFormData] = useState<
// 		Map<string, Map<number, AnswerValue>>
// 	>(new Map());

// 	// Helper function to get the latest submission for each form
// 	const getLatestSubmissions = (
// 		submissions: PublicSubmission[],
// 	): PublicSubmission[] => {
// 		const latestByFormId = new Map<string, PublicSubmission>();

// 		submissions.forEach((submission) => {
// 			const existing = latestByFormId.get(submission.formId);
// 			if (
// 				!existing ||
// 				new Date(submission.updatedAt) > new Date(existing.updatedAt)
// 			) {
// 				latestByFormId.set(submission.formId, submission);
// 			}
// 		});

// 		return Array.from(latestByFormId.values());
// 	};

// 	// Fetch report data
// 	useEffect(() => {
// 		const fetchReportData = async () => {
// 			if (!id) return;

// 			setLoading(true);
// 			setError(null);

// 			const { data: res, error } = await handleApi(() =>
// 				getWorkOrderReport(id),
// 			);

// 			setLoading(false);

// 			if (error) {
// 				setError(error.message);
// 				notifyError("Gagal memuat laporan", error.message);
// 				return;
// 			}

// 			setReportData(res?.data ?? null);
// 		};

// 		void fetchReportData();
// 	}, [id]);

// 	// Initialize form data from reportForms or submissions
// 	useEffect(() => {
// 		if (!reportData) return;

// 		const initialData = new Map<string, Map<number, AnswerValue>>();

// 		// Get only the latest submissions for each form
// 		const latestSubmissions =
// 			reportData.submissions ?
// 				getLatestSubmissions(reportData.submissions)
// 			:	[];

// 		reportData.reportForms.forEach((reportForm) => {
// 			const fieldMap = new Map<number, AnswerValue>();

// 			// Check if there's a submission for this form (use latest only)
// 			const submission = latestSubmissions.find(
// 				(sub) => sub.formId === reportForm.form._id,
// 			);

// 			reportForm.form.fields.forEach((field) => {
// 				let answer: AnswerValue = null;

// 				// Use data from submission if it exists
// 				if (submission) {
// 					const submittedData = submission.fieldsData.find(
// 						(fd) => Number(fd.order) === field.order,
// 					);
// 					answer = submittedData?.value ?? null;
// 				}

// 				fieldMap.set(field.order, answer);
// 			});

// 			initialData.set(reportForm.form._id, fieldMap);
// 		});

// 		setFormData(initialData);
// 		setOriginalFormData(new Map(initialData));
// 	}, [reportData]);

// 	// Handle field value change
// 	const handleFieldChange = (
// 		formId: string,
// 		order: number,
// 		value: AnswerValue,
// 	) => {
// 		setFormData((prev) => {
// 			const newData = new Map(prev);
// 			const fieldMap = new Map(newData.get(formId) || new Map());
// 			fieldMap.set(order, value);
// 			newData.set(formId, fieldMap);
// 			return newData;
// 		});
// 	};

// 	// Check if there are changes
// 	const hasChanges = () => {
// 		if (formData.size !== originalFormData.size) return true;

// 		for (const [formId, fieldMap] of formData.entries()) {
// 			const originalFieldMap = originalFormData.get(formId);
// 			if (!originalFieldMap) return true;

// 			if (fieldMap.size !== originalFieldMap.size) return true;

// 			for (const [order, value] of fieldMap.entries()) {
// 				const originalValue = originalFieldMap.get(order);
// 				if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
// 					return true;
// 				}
// 			}
// 		}

// 		return false;
// 	};

// 	// Handle save with confirmation
// 	const handleSave = () => {
// 		if (!reportData || !id) return;

// 		showDialog({
// 			title: "Konfirmasi Simpan",
// 			description:
// 				"Apakah Anda yakin ingin menyimpan perubahan formulir laporan kerja?",
// 			confirmText: "Simpan",
// 			cancelText: "Batal",
// 			onConfirm: async () => {
// 				setIsSaving(true);

// 				// Build submissions array
// 				const submissions = reportData.reportForms
// 					.map((reportForm) => {
// 						const fieldMap = formData.get(reportForm.form._id) || new Map();
// 						const fieldsData: FieldData[] = Array.from(fieldMap.entries()).map(
// 							([order, value]) => ({
// 								order: order,
// 								value: value ?? "",
// 							}),
// 						);

// 						// Check if form has any filled fields
// 						const hasFilledFields = Array.from(fieldMap.values()).some(
// 							(value) => {
// 								if (value === null || value === undefined) return false;
// 								if (typeof value === "string" && value.trim() === "")
// 									return false;
// 								if (Array.isArray(value) && value.length === 0) return false;
// 								return true;
// 							},
// 						);

// 						if (!hasFilledFields) return null;

// 						return {
// 							formId: reportForm.form._id,
// 							fieldsData,
// 						};
// 					})
// 					.filter(
// 						(sub): sub is { formId: string; fieldsData: FieldData[] } =>
// 							sub !== null,
// 					);

// 				const { error } = await handleApi(() =>
// 					submitWorkOrderReportApi(id, submissions),
// 				);

// 				setIsSaving(false);

// 				if (error) {
// 					notifyError("Gagal menyimpan", error.message);
// 					return;
// 				}

// 				notifySuccess(
// 					"Berhasil disimpan",
// 					"Formulir laporan kerja telah disimpan",
// 				);

// 				// Exit edit mode
// 				setIsEditMode(false);

// 				// Refetch report data to get updated submissions
// 				const { data: res, error: fetchError } = await handleApi(() =>
// 					getWorkOrderReport(id),
// 				);

// 				if (!fetchError && res?.data) {
// 					setReportData(res.data);
// 				}
// 			},
// 		});
// 	};

// 	// Handle cancel with confirmation
// 	const handleCancel = () => {
// 		showDialog({
// 			title: "Konfirmasi Batal",
// 			description:
// 				"Apakah Anda yakin ingin membatalkan perubahan? Semua perubahan yang belum disimpan akan hilang.",
// 			confirmText: "Ya, Batalkan",
// 			cancelText: "Tidak",
// 			onConfirm: () => {
// 				setFormData(new Map(originalFormData));
// 				if (isEditMode) {
// 					setIsEditMode(false);
// 				}
// 			},
// 		});
// 	};

// 	// Handle enter edit mode
// 	const handleEnterEditMode = () => {
// 		setIsEditMode(true);
// 	};

// 	// Get status badge configuration
// 	const getStatusConfig = (status: string) => {
// 		switch (status.toLowerCase()) {
// 			case "unstarted":
// 				return {
// 					className: "bg-gray-100 text-gray-700 border border-gray-200",
// 					label: "Belum Dimulai",
// 					icon: Clock,
// 				};
// 			case "in_progress":
// 				return {
// 					className: "bg-blue-100 text-blue-700 border border-blue-200",
// 					label: "Sedang Dikerjakan",
// 					icon: Clock,
// 				};
// 			case "completed":
// 				return {
// 					className: "bg-green-100 text-green-700 border border-green-200",
// 					label: "Selesai",
// 					icon: CheckCircle,
// 				};
// 			case "cancelled":
// 				return {
// 					className: "bg-red-100 text-red-700 border border-red-200",
// 					label: "Dibatalkan",
// 					icon: XCircle,
// 				};
// 			default:
// 				return {
// 					className: "bg-gray-100 text-gray-700 border border-gray-200",
// 					label: status,
// 					icon: Clock,
// 				};
// 		}
// 	};

// 	const statusConfig = reportData ? getStatusConfig(reportData.status) : null;

// 	return (
// 		<>
// 			{/* Header Section */}
// 			<PageHeader
// 				title="Laporan Tugas Kerja"
// 				subtitle="Kelola formulir laporan dari tugas kerja"
// 				backPath={true}
// 			/>

// 			{/* Loading State */}
// 			{loading && <SectionLoading message="Memuat laporan..." />}

// 			{/* Error State */}
// 			{error && !loading && (
// 				<Card className="p-8 border-red-200 bg-red-50">
// 					<div className="flex flex-col items-center gap-3 text-center">
// 						<XCircle className="w-12 h-12 text-red-500" />
// 						<div>
// 							<h3 className="font-semibold text-red-900">
// 								Gagal Memuat Laporan
// 							</h3>
// 							<p className="text-sm text-red-700 mt-1">{error}</p>
// 						</div>
// 						<Button onClick={() => navigate(-1)} variant="outline" size="sm">
// 							Kembali
// 						</Button>
// 					</div>
// 				</Card>
// 			)}

// 			{/* Content */}
// 			{!loading && !error && reportData && (
// 				<div className="space-y-6">
// 					{/* Work Order Info Card - Minimalist */}
// 					<Card className="border shadow-sm bg-white">
// 						<div className="p-6">
// 							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
// 								<div className="flex items-center gap-4">
// 									<div
// 										className={`p-3 rounded-full ${
// 											statusConfig?.className.includes("bg-blue") ?
// 												"bg-blue-50 text-blue-600"
// 											: statusConfig?.className.includes("bg-green") ?
// 												"bg-green-50 text-green-600"
// 											: statusConfig?.className.includes("bg-red") ?
// 												"bg-red-50 text-red-600"
// 											:	"bg-gray-50 text-gray-600"
// 										}`}>
// 										<FileText className="w-6 h-6" />
// 									</div>
// 									<div>
// 										<h2 className="text-lg font-bold text-gray-900">
// 											Informasi Tugas Kerja
// 										</h2>
// 										<div className="flex items-center gap-2 mt-1">
// 											{statusConfig && (
// 												<Badge
// 													className={`${statusConfig.className} border px-2.5 py-0.5 rounded-full font-medium shadow-none`}>
// 													{statusConfig.label}
// 												</Badge>
// 											)}
// 										</div>
// 									</div>
// 								</div>

// 								<div className="flex items-center gap-8 border-t sm:border-t-0 pt-4 sm:pt-0">
// 									<div className="flex flex-col items-start sm:items-end">
// 										<span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
// 											Dibuat
// 										</span>
// 										<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
// 											<Calendar className="w-4 h-4 text-gray-400" />
// 											{new Date(reportData.createdAt).toLocaleDateString(
// 												"id-ID",
// 												{
// 													day: "2-digit",
// 													month: "long",
// 													year: "numeric",
// 												},
// 											)}
// 										</div>
// 									</div>

// 									{reportData.completedAt && (
// 										<div className="flex flex-col items-start sm:items-end">
// 											<span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
// 												Selesai
// 											</span>
// 											<div className="flex items-center gap-2 text-sm font-medium text-green-700">
// 												<CheckCircle className="w-4 h-4 text-green-500" />
// 												{new Date(reportData.completedAt).toLocaleDateString(
// 													"id-ID",
// 													{
// 														day: "2-digit",
// 														month: "long",
// 														year: "numeric",
// 													},
// 												)}
// 											</div>
// 										</div>
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 					</Card>

// 					{/* Tabs */}
// 					<Tabs defaultValue="form">
// 						<TabsList>
// 							<TabsTrigger value="form">Formulir Laporan</TabsTrigger>
// 							<TabsTrigger value="submission">Pengajuan Laporan</TabsTrigger>
// 						</TabsList>

// 						{/* TAB 1: FORMULIR LAPORAN */}
// 						<TabsContent value="form">
// 							<Card className="border rounded-xl shadow-sm mt-6">
// 								<CardHeader>
// 									<h2 className="text-lg font-semibold">Formulir Laporan</h2>
// 									<p className="text-sm text-muted-foreground">
// 										Isi formulir laporan untuk tugas kerja ini
// 									</p>
// 								</CardHeader>

// 								<div className="content p-6">
// 									{reportData.reportForms.length === 0 ?
// 										<div className="p-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
// 											<div className="flex flex-col items-center gap-3">
// 												<div className="p-4 rounded-full bg-muted">
// 													<FileText className="w-8 h-8 text-muted-foreground" />
// 												</div>
// 												<p className="text-sm text-muted-foreground">
// 													Belum ada formulir laporan
// 												</p>
// 											</div>
// 										</div>
// 									:	reportData.reportForms
// 											.sort((a, b) => a.order - b.order)
// 											.map((reportForm, index) => (
// 												<div key={index} className="mb-8">
// 													<h2 className="text-lg font-semibold">
// 														{reportForm.form?.title}
// 													</h2>
// 													<p className="text-sm text-muted-foreground">
// 														{reportForm.form?.description}
// 													</p>
// 													<div className="mt-4 space-y-4">
// 														{reportForm.form.fields
// 															.sort((a, b) => a.order - b.order)
// 															.map((field) => {
// 																const fieldMap = formData.get(
// 																	reportForm.form._id,
// 																);
// 																const answer =
// 																	fieldMap?.get(field.order) ?? null;

// 																return (
// 																	<Card
// 																		key={field.order}
// 																		className="shadow-sm border rounded-lg p-4 bg-white">
// 																		<FormFieldViewer
// 																			field={field}
// 																			answer={answer}
// 																			onChange={(value) =>
// 																				handleFieldChange(
// 																					reportForm.form._id,
// 																					field.order,
// 																					value,
// 																				)
// 																			}
// 																		/>
// 																	</Card>
// 																);
// 															})}
// 													</div>
// 												</div>
// 											))
// 									}
// 								</div>

// 								{/* Save and Cancel Buttons */}
// 								{hasChanges() && (
// 									<div className="flex items-center justify-end border-t-2 mx-5">
// 										<div className="flex items-center gap-2 pt-5 pb-3">
// 											<Button
// 												variant="outline"
// 												onClick={handleCancel}
// 												disabled={isSaving}>
// 												Batal
// 											</Button>
// 											<Button onClick={handleSave} disabled={isSaving}>
// 												{isSaving ? "Menyimpan..." : "Simpan"}
// 											</Button>
// 										</div>
// 									</div>
// 								)}
// 							</Card>
// 						</TabsContent>

// 						{/* TAB 2: PENGAJUAN LAPORAN */}
// 						<TabsContent value="submission">
// 							<Card className="border rounded-xl shadow-sm mt-6">
// 								<CardHeader>
// 									<div className="flex items-center justify-between">
// 										<div>
// 											<h2 className="text-lg font-semibold">
// 												Formulir Laporan yang Telah Disubmit
// 											</h2>
// 											<p className="text-sm text-muted-foreground">
// 												Hasil pengajuan laporan tugas kerja
// 											</p>
// 										</div>
// 										{!isEditMode &&
// 											reportData.submissions &&
// 											reportData.submissions.length > 0 && (
// 												<Button
// 													onClick={handleEnterEditMode}
// 													variant="outline"
// 													size="sm"
// 													className="gap-2">
// 													<Pencil className="w-4 h-4" />
// 													Edit
// 												</Button>
// 											)}
// 									</div>
// 									{isEditMode && (
// 										<div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
// 											<svg
// 												xmlns="http://www.w3.org/2000/svg"
// 												className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
// 												viewBox="0 0 20 20"
// 												fill="currentColor">
// 												<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
// 											</svg>
// 											<div>
// 												<p className="text-sm font-medium text-amber-900">
// 													📝 Mode Edit Aktif
// 												</p>
// 												<p className="text-xs text-amber-700 mt-0.5">
// 													Anda dapat mengedit form. Klik Simpan untuk menyimpan
// 													perubahan atau Batal untuk membatalkan.
// 												</p>
// 											</div>
// 										</div>
// 									)}
// 								</CardHeader>

// 								<CardContent className="space-y-6">
// 									{(
// 										!reportData.submissions ||
// 										reportData.submissions.length === 0
// 									) ?
// 										<div className="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/30 hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition min-h-[160px]">
// 											<p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition">
// 												Laporan belum dikerjakan
// 											</p>
// 										</div>
// 									:	getLatestSubmissions(reportData.submissions).map(
// 											(submission) => {
// 												// Find the corresponding form
// 												const reportForm = reportData.reportForms.find(
// 													(rf) => rf.form._id === submission.formId,
// 												);

// 												if (!reportForm) return null;

// 												return (
// 													<div key={submission._id} className="space-y-4">
// 														<div className="flex items-center justify-between">
// 															<div>
// 																<h3 className="text-lg font-semibold">
// 																	{reportForm.form?.title}
// 																</h3>
// 																<p className="text-sm text-muted-foreground">
// 																	{reportForm.form?.description}
// 																</p>
// 															</div>
// 															<div className="text-right">
// 																<p className="text-xs text-muted-foreground">
// 																	Terakhir diperbarui:
// 																</p>
// 																<p className="text-sm font-medium">
// 																	{new Date(
// 																		submission.updatedAt,
// 																	).toLocaleDateString("id-ID", {
// 																		day: "2-digit",
// 																		month: "long",
// 																		year: "numeric",
// 																		hour: "2-digit",
// 																		minute: "2-digit",
// 																	})}
// 																</p>
// 															</div>
// 														</div>

// 														<div className="space-y-4">
// 															{reportForm.form.fields
// 																.sort((a, b) => a.order - b.order)
// 																.map((field) => {
// 																	const fieldData = submission.fieldsData.find(
// 																		(fd) => Number(fd.order) === field.order,
// 																	);

// 																	// Get current value from formData if in edit mode
// 																	const fieldMap = formData.get(
// 																		reportForm.form._id,
// 																	);
// 																	const currentValue =
// 																		isEditMode ?
// 																			(fieldMap?.get(field.order) ??
// 																			fieldData?.value ??
// 																			null)
// 																		:	(fieldData?.value ?? null);

// 																	return (
// 																		<Card
// 																			key={field.order}
// 																			className="shadow-sm border rounded-lg p-4 bg-white">
// 																			<FormFieldViewer
// 																				field={field}
// 																				answer={currentValue}
// 																				readOnly={!isEditMode}
// 																				onChange={
// 																					isEditMode ?
// 																						(value) =>
// 																							handleFieldChange(
// 																								reportForm.form._id,
// 																								field.order,
// 																								value,
// 																							)
// 																					:	undefined
// 																				}
// 																			/>
// 																		</Card>
// 																	);
// 																})}
// 														</div>
// 													</div>
// 												);
// 											},
// 										)
// 									}
// 								</CardContent>

// 								{/* Save and Cancel Buttons - only in edit mode with changes */}
// 								{isEditMode && hasChanges() && (
// 									<div className="flex items-center justify-end border-t-2 mx-5">
// 										<div className="flex items-center gap-2 pt-5 pb-3">
// 											<Button
// 												variant="outline"
// 												onClick={handleCancel}
// 												disabled={isSaving}>
// 												Batal
// 											</Button>
// 											<Button onClick={handleSave} disabled={isSaving}>
// 												{isSaving ? "Menyimpan..." : "Simpan"}
// 											</Button>
// 										</div>
// 									</div>
// 								)}
// 							</Card>
// 						</TabsContent>
// 					</Tabs>
// 				</div>
// 			)}
// 		</>
// 	);
// };

// export default CompanyReportWo;
