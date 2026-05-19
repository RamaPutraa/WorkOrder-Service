import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import {
	getDetailClientServiceRequestApi,
	submitReviewApi,
	getClientWorkReport,
} from "../services/public-services";
import { uploadFileApi } from "@/lib/file-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	FileText,
	CheckCircle2,
	Timer,
	Send,
	Info,
	Calendar,
	User,
	Tag,
	Loader,
	ChevronDown,
	Hammer,
	CircleDot,
	Eye,
} from "lucide-react";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { SrStatusStepper } from "@/features/owner/business/components/sr-status-stepper";
import { Badge } from "@/components/ui/badge";

// ── Status badge config ──────────────────────────────────────────────────────
type SrStatus =
	| "received"
	| "approved"
	| "rejected"
	| "on_progress"
	| "completed"
	| "cancelled"
	| "unprocessable"
	| "partial_completed"
	| "closed";

const STATUS_CONFIG: Record<SrStatus, { label: string; className: string }> = {
	received: {
		label: "Menunggu Persetujuan",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	approved: {
		label: "Disetujui",
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	rejected: {
		label: "Ditolak",
		className: "bg-red-50 text-red-700 border-red-200",
	},
	on_progress: {
		label: "Sedang Dikerjakan",
		className: "bg-violet-50 text-violet-700 border-violet-200",
	},
	completed: {
		label: "Selesai",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	cancelled: {
		label: "Dibatalkan",
		className: "bg-zinc-100 text-zinc-600 border-zinc-200",
	},
	unprocessable: {
		label: "Gagal Diproses",
		className: "bg-red-50 text-red-700 border-red-200",
	},
	partial_completed: {
		label: "Sebagian Selesai",
		className: "bg-teal-50 text-teal-700 border-teal-200",
	},
	closed: {
		label: "Ditutup",
		className: "bg-purple-100 text-purple-600 border-purple-200",
	},
};

const StatusBadge = ({ status }: { status: string }) => {
	const cfg = STATUS_CONFIG[status as SrStatus] ?? {
		label: status,
		className: "bg-muted text-muted-foreground border-border",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
			<span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
			{cfg.label}
		</span>
	);
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const buildFieldMap = (
	fields: Field[],
	submission: SubmissionObject | null,
): Map<number, AnswerValue> => {
	const map = new Map<number, AnswerValue>();
	fields.forEach((field) => {
		const saved = submission?.fieldsData?.find(
			(fd) => fd.order === field.order,
		);
		map.set(field.order, (saved?.value ?? null) as AnswerValue);
	});
	return map;
};

// ─── Work Report Stage Card ───────────────────────────────────────────────────
const WorkReportCard = ({
	form,
	submission,
	index,
}: {
	form: Form;
	submission?: SubmissionObject;
	index: number;
}) => {
	const status = submission?.status || "on_progress";
	const [open, setOpen] = useState(
		status === "approved" || status === "submitted",
	);
	const hasFields =
		submission && submission.fieldsData && submission.fieldsData.length > 0;
	const submittedAt = submission?.createdAt ?? null;

	return (
		<div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm transition-all duration-200 hover:shadow-md">
			{/* Header */}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left">
				<div className="flex items-center gap-3">
					<div className="min-w-0">
						<p className="text-sm font-semibold text-foreground truncate">
							{form.title || `Tahap ${index + 1}`}
						</p>
						{submittedAt && (
							<p className="text-xs text-muted-foreground mt-0.5">
								{new Date(submittedAt).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-3 shrink-0">
					{hasFields && (
						<ChevronDown
							className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
								open ? "rotate-180" : ""
							}`}
						/>
					)}
				</div>
			</button>

			{/* Content */}
			{open && hasFields && submission && (
				<div className="px-5 pb-5 pt-1 border-t border-border/40 bg-muted/10">
					<div className="space-y-4 mt-3">
						{[...form.fields]
							.sort((a, b) => a.order - b.order)
							.map((field) => {
								const answer =
									submission.fieldsData.find((fd) => fd.order === field.order)
										?.value ?? null;
								return (
									<div key={field.order} className="pb-2">
										<FormFieldViewer
											field={field}
											answer={answer as AnswerValue}
											readOnly={true}
										/>
									</div>
								);
							})}
					</div>
				</div>
			)}

			{!hasFields && (
				<div className="px-5 py-4 border-t border-border/40 bg-muted/10">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<CircleDot className="w-3.5 h-3.5 text-amber-400" />
						<span>
							Laporan tahap ini belum tersedia — staf masih dalam proses
							pengerjaan.
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

// ─── Component ────────────────────────────────────────────────────────────────

const ServiceDetailSubmit = () => {
	const { id } = useParams<{ id: string }>();

	const [detail, setDetail] = useState<RequesterSRDetailRequest | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Report state
	const [workReport, setWorkReport] = useState<RequesterWorkReport | null>(
		null,
	);

	// Review form state
	const [reviewFormData, setReviewFormData] = useState<
		Map<number, AnswerValue>
	>(new Map());
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	// ── Fetch ──
	const fetchDetail = async () => {
		if (!id) {
			setError("ID pengajuan tidak ditemukan");
			notifyError("Gagal memuat detail", "ID pengajuan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailClientServiceRequestApi(id),
		);

		const { data: reportRes } = await handleApi(() => getClientWorkReport(id));
		if (reportRes?.data) {
			setWorkReport(reportRes.data);
		}

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat detail pengajuan", error.message);
			return;
		}

		const data = res?.data ?? null;
		setDetail(data);

		// Initialize review form data jika ada reviewForm
		if (data?.reviewForm?.fields) {
			setReviewFormData(
				buildFieldMap(data.reviewForm.fields, data.reviewSubmission),
			);
		}
	};

	useEffect(() => {
		if (id) fetchDetail();
	}, [id]);

	// ── Derived state ──
	const srStatus = detail?.serviceRequestStatus;
	const canFillReview = srStatus === "completed" && !detail?.reviewSubmission;

	// ── Handlers ──
	const handleReviewFieldChange = (order: number, value: AnswerValue) => {
		setReviewFormData((prev) => {
			const next = new Map(prev);
			next.set(order, value);
			return next;
		});
	};

	const handleSubmitReview = async () => {
		if (!detail || !id) return;

		const reviewFormId = detail.reviewForm?._id;
		if (!reviewFormId) {
			notifyError("Gagal", "Formulir ulasan tidak ditemukan");
			return;
		}

		setIsSubmittingReview(true);

		// 1. Upload pending files first
		for (const [order, value] of reviewFormData.entries()) {
			if (value instanceof File) {
				const { error, data } = await handleApi(() => uploadFileApi(value));
				if (error || !data) {
					setIsSubmittingReview(false);
					notifyError(
						"Gagal mengirim ulasan",
						"Gagal mengunggah gambar. Silakan coba lagi.",
					);
					return;
				}
				// Replace File object with URL string
				reviewFormData.set(order, data.data.url);
			}
		}

		const fieldsData: FieldData[] = Array.from(reviewFormData.entries()).map(
			([order, value]) => ({
				order,
				value: (value ?? "") as string | number | string[] | File | null,
			}),
		);

		// 2. Validate mandatory fields
		const missingFields: string[] = [];
		detail.reviewForm?.fields?.forEach((field) => {
			if (field.required) {
				const value = reviewFormData.get(field.order);
				const isEmpty =
					value === null ||
					value === undefined ||
					value === "" ||
					(Array.isArray(value) && value.length === 0);
				if (isEmpty) {
					missingFields.push(field.label || `Field #${field.order}`);
				}
			}
		});

		if (missingFields.length > 0) {
			setIsSubmittingReview(false);
			notifyError(
				"Validasi Gagal",
				`Harap isi field wajib: ${missingFields.join(", ")}`,
			);
			return;
		}

		// Cek semua field terisi (minimal tidak semua kosong)
		const hasAnyFilled = fieldsData.some(
			(fd) => fd.value !== null && fd.value !== "",
		);
		if (!hasAnyFilled) {
			setIsSubmittingReview(false);
			notifyError("Validasi", "Isi minimal satu field pada formulir ulasan.");
			return;
		}

		const submissionPayload: RequesterSubmitRequest = {
			submission: {
				formId: reviewFormId,
				fieldsData,
			},
		};

		const { error } = await handleApi(() =>
			submitReviewApi(id, submissionPayload),
		);

		setIsSubmittingReview(false);
		setConfirmOpen(false);

		if (error) {
			notifyError("Gagal mengirim ulasan", error.message);
			return;
		}

		notifySuccess("Ulasan Terkirim", "Ulasan layanan berhasil dikirimkan.");
		// Re-fetch untuk update UI
		await fetchDetail();
	};

	// ── Forms to render ──
	const formsToRender =
		detail ?
			[
				{
					id: "intake",
					label: "Formulir Pengajuan",
					form: detail.intakeForm,
					submission: detail.intakeSubmission,
					readOnly: true,
				},
				{
					id: "review",
					label: "Formulir Ulasan",
					form: detail.reviewForm,
					submission: detail.reviewSubmission,
					readOnly: !canFillReview,
				},
			].filter((item) => item.form)
		:	[];

	if (error) return <p className="text-red-500 p-4">{error}</p>;

	return (
		<>
			{/* Header */}
			<PageHeader
				title={
					!detail ?
						<div className="flex items-center gap-1.5">
							Detail Service{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Detail — ${detail?.service?.title}`
				}
				subtitle={
					!detail ?
						<div className="flex items-center gap-1.5">
							Memuat detail layanan{" "}
							<TextLoading variant="dots" message="" className="w-60" />
						</div>
					:	`Berikut merupakan detail service ${detail?.service?.title} yang Anda ajukan.`
				}
				backPath={true}
			/>

			{/* Content */}
			{loading || !detail ?
				<SectionLoading message="Memuat detail pengajuan..." />
			:	<div className="space-y-6">
					{/* Summary Card */}
					<Card className="relative overflow-hidden border border-border shadow-sm transition-all duration-200 hover:shadow-md">
						<div className="p-5 sm:p-6 flex flex-col gap-6">
							{/* 1. HEADER: Icon, Title, Description & Badge */}
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="flex items-start gap-4">
									<div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary shadow-sm">
										<FileText className="w-6 h-6 " />
									</div>

									<div className="space-y-1.5 mt-0.5">
										<h2 className="text-lg font-bold tracking-tight text-foreground leading-snug">
											{detail.service?.title || "Detail Layanan"}
										</h2>
										{detail.service?.description && (
											<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
												{detail.service.description}
											</p>
										)}
									</div>
								</div>

								{detail?.code && (
									<Badge
										variant="outline"
										className="shrink-0 font-mono text-xs font-semibold px-2.5 py-1 border-border/50 shadow-sm">
										{detail.code}
									</Badge>
								)}
							</div>

							{/* 2. META INFO */}
							<div className="flex flex-wrap items-center w-fit gap-x-5 gap-y-3 p-3.5 rounded-xl bg-muted/40 border border-border/40 text-sm">
								{detail.requestedBy?.name && (
									<div className="flex items-center gap-2">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-background border shadow-sm">
											<User className="w-3.5 h-3.5 text-muted-foreground" />
										</div>
										<span className="font-medium text-foreground/80">
											{detail.requestedBy.name}
										</span>
									</div>
								)}

								<div className="hidden sm:block w-1 h-1 rounded-full bg-border" />

								{detail.createdAt && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Calendar className="w-4 h-4 opacity-70" />
										<span className="font-medium">
											{new Date(detail.createdAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</span>
									</div>
								)}

								<div className="hidden sm:block w-1 h-1 rounded-full bg-border" />

								{detail.service?.accessType && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Tag className="w-4 h-4 opacity-70" />
										<span className="capitalize font-medium">
											{detail.service.accessType.replace(/_/g, " ")}
										</span>
									</div>
								)}
							</div>

							{/* 3. STATUS: Badge (mobile) | Stepper (sm+) */}
							<div className="pt-1">
								<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
									Status Progress
								</p>

								<div className="sm:hidden">
									<StatusBadge status={detail.serviceRequestStatus} />
								</div>

								<div className="hidden sm:block">
									<SrStatusStepper
										sr={{
											serviceRequestStatus: detail.serviceRequestStatus,
											createdAt: detail.createdAt,
											updatedAt: detail.updatedAt,
											approvedAt: detail.approvedAt,
											onProgressAt: detail.onProgressAt,
											startedAt: detail.startedAt,
											completedAt: detail.completedAt,
											partialCompletedAt: detail.partialCompletedAt,
											rejectedAt: detail.rejectedAt,
											unprocessableAt: detail.unprocessableAt,
											cancelledAt: detail.cancelledAt,
											closedAt: detail.closedAt,
											failedAt: detail.failedAt,
										}}
									/>
								</div>
							</div>
						</div>
					</Card>

					{/* Info banner jika bisa mengisi review */}
					{canFillReview && (
						<div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
							<Info className="size-4 shrink-0 mt-0.5" />
							<p>
								Layanan Anda telah selesai dikerjakan. Silakan isi{" "}
								<span className="font-semibold">Formulir Ulasan</span> di bawah
								untuk memberikan penilaian terhadap layanan yang diterima.
							</p>
						</div>
					)}

					{srStatus === "partial_completed" && (
						<div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm">
							<Info className="size-4 shrink-0 mt-0.5" />
							<p>
								Layanan Anda telah selesai dikerjakan. Namun layanan anda
								<span className="font-semibold"> tidak maksimal</span>{" "}
								terselesaikan.
							</p>
						</div>
					)}

					{srStatus === "unprocessable" && (
						<div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
							<Info className="size-4 shrink-0 mt-0.5" />
							<p>
								Layanan Anda{" "}
								<span className="font-semibold"> tidak dapat diproses.</span>{" "}
								Silahkan ajukan layanan ulang
							</p>
						</div>
					)}

					{srStatus === "on_progress" && (
						<div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
							<Info className="size-4 shrink-0 mt-0.5" />
							<p>
								Layanan Anda{" "}
								<span className="font-semibold"> sedang dikerjakan.</span>{" "}
								Silahkan menunggu
							</p>
						</div>
					)}

					{/* ── Work Report Section (mock, replace with API) ── */}
					{(srStatus === "on_progress" ||
						srStatus === "completed" ||
						srStatus === "partial_completed" ||
						srStatus === "closed") && (
						<div className="space-y-3">
							{/* Section Header */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
										<Hammer className="w-4 h-4" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-foreground tracking-tight">
											Laporan Pengerjaan
										</h3>
										<p className="text-xs text-muted-foreground">
											Hasil laporan dari setiap tahap pengerjaan oleh tim staf
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border/40">
									<Eye className="w-3.5 h-3.5" />
									<span>{workReport?.workReportForms?.length || 0} tahap</span>
								</div>
							</div>

							{/* Stage Cards */}
							<div className="space-y-3">
								{workReport?.workReportForms?.map((form, idx) => {
									const submission = workReport.submissions?.find(
										(s) => s.formId === form._id,
									);
									return (
										<WorkReportCard
											key={form._id}
											form={form}
											submission={submission}
											index={idx}
										/>
									);
								})}
								{(!workReport?.workReportForms ||
									workReport.workReportForms.length === 0) && (
									<div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-xl">
										Belum ada laporan pengerjaan yang dibagikan.
									</div>
								)}
							</div>

							{/* Summary footer */}
							{workReport?.workReportForms &&
								workReport.workReportForms.length > 0 &&
								(() => {
									const submissions = workReport.submissions ?? [];
									const approvedCount = workReport.workReportForms.filter((f) =>
										submissions.some(
											(s) => s.formId === f._id && s.status === "approved",
										),
									).length;
									const submittedCount = workReport.workReportForms.filter((f) =>
										submissions.some(
											(s) => s.formId === f._id && s.status === "submitted",
										),
									).length;
									const totalReports = workReport.workReportForms.length;
									const inProgressCount =
										totalReports - approvedCount - submittedCount;

									return (
										<div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground">
											<div className="flex flex-wrap items-center gap-3">
												<span className="flex items-center gap-1.5">
													<span className="w-2 h-2 rounded-full bg-emerald-400" />
													{approvedCount} Disetujui
												</span>
												<span className="flex items-center gap-1.5">
													<span className="w-2 h-2 rounded-full bg-blue-400" />
													{submittedCount} Menunggu
												</span>
												<span className="flex items-center gap-1.5">
													<span className="w-2 h-2 rounded-full bg-amber-400" />
													{inProgressCount} Berlangsung
												</span>
											</div>
										</div>
									);
								})()}
						</div>
					)}
					{/* TODO: ini belum cek submission apakah yang sudah terbaru? */}
					{/* FIXME: response daat report beda */}
					{/* Accordion */}
					<Accordion
						type="multiple"
						defaultValue={["intake", "review"]}
						className="space-y-4">
						{formsToRender.map((item) => {
							const { id: itemId, label, form, submission, readOnly } = item;
							const isReviewItem = itemId === "review";
							const isSubmitted = submission && submission.status !== "draft";

							return (
								<AccordionItem
									key={itemId}
									value={itemId}
									className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm data-[state=open]:border-primary/20 transition-all duration-200">
									<AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/40 transition-colors cursor-pointer [&[data-state=open]]:bg-muted/20">
										<div className="flex items-center gap-4 flex-1 text-left">
											{/* Icon */}
											<div
												className={`shrink-0 p-2 rounded-lg transition-colors ${
													isSubmitted ? "bg-emerald-50 text-emerald-600"
													: isReviewItem && canFillReview ?
														"bg-blue-50 text-blue-600"
													:	"bg-amber-50 text-amber-600"
												}`}>
												{isSubmitted ?
													<CheckCircle2 className="w-4 h-4" />
												:	<Timer className="w-4 h-4" />}
											</div>

											{/* Info */}
											<div className="flex-1 min-w-0">
												<div className="flex flex-wrap items-center gap-2">
													<span className="font-semibold text-sm tracking-tight line-clamp-1">
														{form?.title}
													</span>
													<Badge
														variant="secondary"
														className="text-[10px] h-4 px-1.5 font-medium rounded hidden md:block">
														{label}
													</Badge>
												</div>
												{form?.description && (
													<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
														{form.description}
													</p>
												)}
											</div>

											{/* Status pill */}
											<div
												className={`hidden sm:flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
													isSubmitted ? "bg-emerald-50 text-emerald-700"
													: isReviewItem && canFillReview ?
														"bg-blue-50 text-blue-700"
													:	"bg-amber-50 text-amber-700"
												}`}>
												<div
													className={`w-1.5 h-1.5 rounded-full ${
														isSubmitted ? "bg-emerald-500"
														: isReviewItem && canFillReview ? "bg-blue-500"
														: "bg-amber-400"
													}`}
												/>
												{isSubmitted ?
													"Disubmit"
												: isReviewItem && canFillReview ?
													"Siap Diisi"
												:	"Menunggu"}
											</div>
										</div>
									</AccordionTrigger>

									<AccordionContent className="px-5 lg:px-6 pb-5">
										{form?.fields && form.fields.length > 0 ?
											<div className="space-y-3 pt-4">
												{[...form.fields]
													.sort((a: any, b: any) => a.order - b.order)
													.map((field: any) => {
														// Untuk review form yang bisa diisi → gunakan state
														const answer =
															isReviewItem && !readOnly ?
																(reviewFormData.get(field.order) ?? null)
															:	((submission?.fieldsData?.find(
																	(fd: any) => fd.order === field.order,
																)?.value ?? null) as AnswerValue);

														return (
															<div key={field.order} className="pb-4">
																<FormFieldViewer
																	field={field}
																	answer={answer}
																	readOnly={readOnly}
																	onChange={
																		isReviewItem && !readOnly ?
																			(value) =>
																				handleReviewFieldChange(
																					field.order,
																					value,
																				)
																		:	undefined
																	}
																/>
															</div>
														);
													})}

												{/* Tombol Submit Review */}
												{isReviewItem && canFillReview && (
													<div className="flex justify-end pt-2 border-t mt-2">
														<Button
															onClick={() => setConfirmOpen(true)}
															disabled={isSubmittingReview}
															className="gap-2 rounded-xl px-6 bg-primary hover:bg-primary/90 hover:cursor-pointer">
															<Send className="size-4" />
															Kirim Ulasan
														</Button>
													</div>
												)}
											</div>
										:	<div className="pt-4">
												<EmptyData />
											</div>
										}
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				</div>
			}

			{/* ─── Confirmation Dialog ─── */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-1">
							<div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
								<Send className="size-5" />
							</div>
							<DialogTitle className="text-base leading-snug">
								Konfirmasi Kirim Ulasan
							</DialogTitle>
						</div>
						<DialogDescription className="text-sm leading-relaxed">
							Anda akan mengirimkan ulasan untuk layanan{" "}
							<span className="font-semibold text-foreground">
								&quot;{detail?.service?.title}&quot;
							</span>
							. Ulasan yang sudah dikirim tidak dapat diubah kembali.
						</DialogDescription>
					</DialogHeader>

					{/* Info box */}
					<div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs leading-relaxed">
						<Info className="size-4 shrink-0 mt-0.5" />
						<p>
							Pastikan seluruh isian pada formulir ulasan sudah benar sebelum
							mengirimkan.
						</p>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setConfirmOpen(false)}
							disabled={isSubmittingReview}
							className="rounded-lg hover:cursor-pointer">
							Batal
						</Button>
						<Button
							onClick={handleSubmitReview}
							disabled={isSubmittingReview}
							className="rounded-lg gap-2 hover:cursor-pointer">
							{isSubmittingReview ?
								<>
									<Loader className="size-4 animate-spin" />
									Mengirim...
								</>
							:	<>
									<Send className="size-4" />
									Ya, Kirim Ulasan
								</>
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ServiceDetailSubmit;
