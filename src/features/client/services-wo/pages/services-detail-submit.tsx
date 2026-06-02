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
	Hammer,
	Star,
	Lock,
	Pencil,
	ChevronRight,
} from "lucide-react";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
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
import WorkReportDrawer from "../components/work-report-drawer";

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
		className: "bg-green-50/50 text-green-700 border-green-200",
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

// ─── Section Header ───────────────────────────────────────────────────────────
const FormSectionHeader = ({
	type,
	title,
	description,
	isSubmitted,
	canFill,
}: {
	type: "intake" | "review";
	title?: string;
	description?: string;
	isSubmitted?: boolean;
	canFill?: boolean;
}) => {
	const isIntake = type === "intake";

	return (
		<div
			className={`relative overflow-hidden rounded-t-2xl px-6 pt-5 pb-4 border-b ${isIntake
				? "bg-slate-50 border-slate-200"
				: isSubmitted
					? "bg-emerald-50 border-emerald-200"
					: canFill
						? "bg-blue-50 border-blue-200"
						: "bg-muted/50 border-border/60"
				}`}>

			<div className="flex items-start gap-3 relative">
				{/* Icon bubble */}
				<div
					className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl shadow-sm ${isIntake
						? "bg-slate-200 text-slate-600"
						: isSubmitted
							? "bg-emerald-200 text-emerald-700"
							: canFill
								? "bg-blue-200 text-blue-700"
								: "bg-muted text-muted-foreground"
						}`}>
					{isIntake ? (
						<FileText className="w-5 h-5" />
					) : isSubmitted ? (
						<CheckCircle2 className="w-5 h-5" />
					) : canFill ? (
						<Pencil className="w-5 h-5" />
					) : (
						<Lock className="w-5 h-5" />
					)}
				</div>

				<div className="flex-1 min-w-0">
					{/* Label chip */}
					<div className="flex items-center gap-2 mb-1">
						<span
							className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isIntake
								? "bg-slate-200 text-slate-600"
								: isSubmitted
									? "bg-emerald-200 text-emerald-700"
									: canFill
										? "bg-blue-200 text-blue-700"
										: "bg-muted text-muted-foreground"
								}`}>
							{isIntake ? "Formulir Pengajuan" : "Formulir Ulasan"}
						</span>

						{/* Status chip */}
						{isIntake && (
							<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
								<Lock className="w-2.5 h-2.5" />
								Hanya Lihat
							</span>
						)}
						{!isIntake && isSubmitted && (
							<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
								<CheckCircle2 className="w-2.5 h-2.5" />
								Sudah Disubmit
							</span>
						)}
						{!isIntake && canFill && !isSubmitted && (
							<span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full animate-pulse">
								<Pencil className="w-2.5 h-2.5" />
								Siap Diisi
							</span>
						)}
					</div>

					<h3 className="text-sm font-bold text-foreground tracking-tight leading-snug">
						{title || (isIntake ? "Detail Pengajuan" : "Penilaian Layanan")}
					</h3>
					{description && (
						<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
							{description}
						</p>
					)}
				</div>
			</div>
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

	// Drawer state
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedReportIndex, setSelectedReportIndex] = useState<number>(0);

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

	// ── Drawer helpers ──
	const selectedForm = workReport?.workReportForms?.[selectedReportIndex] ?? null;
	const selectedSubmission = selectedForm
		? workReport?.submissions?.find((s) => s.formId === selectedForm._id) ?? null
		: null;

	const handleOpenDrawer = (index: number) => {
		setSelectedReportIndex(index);
		setDrawerOpen(true);
	};

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

	if (error) return <EmptyData />

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
						: `Detail — ${detail?.service?.title}`
				}
				subtitle={
					!detail ?
						<div className="flex items-center gap-1.5">
							Memuat detail layanan{" "}
							<TextLoading variant="dots" message="" className="w-60" />
						</div>
						: `Berikut merupakan detail service ${detail?.service?.title} yang Anda ajukan.`
				}
				backPath={true}
			/>

			{/* Content */}
			{loading || !detail ?
				<SectionLoading message="Memuat detail pengajuan..." />
				: <div className="space-y-6">
					{/* ── Summary Card ── */}
					<Card className="relative overflow-hidden border border-border shadow-sm transition-all duration-200 hover:shadow-md">
						<div className="p-5 sm:p-6 flex flex-col gap-6">
							{/* 1. HEADER: Icon, Title, Description & Badge */}
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="flex items-start gap-4">
									<div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary shadow-sm">
										<FileText className="w-6 h-6" />
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

					{/* ── Status Banners ── */}
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
								<span className="font-semibold">tidak dapat diproses.</span>{" "}
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

					{/* ═══════════════════════════════════════════════════════
					    SECTION 1: INTAKE FORM (Formulir Pengajuan)
					    ═══════════════════════════════════════════════════════ */}
					{detail.intakeForm && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<div className="h-px flex-1 bg-border/60" />
								<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2">
									Formulir Pengajuan
								</span>
								<div className="h-px flex-1 bg-border/60" />
							</div>

							<div className="rounded-2xl border border-slate-200 bg-card shadow-sm overflow-hidden">
								<FormSectionHeader
									type="intake"
									title={detail.intakeForm.title}
									description={detail.intakeForm.description}
									isSubmitted={
										!!detail.intakeSubmission &&
										detail.intakeSubmission.status !== "draft"
									}
								/>

								{/* Body */}
								<div className="p-5 space-y-1">
									{detail.intakeForm.fields &&
										detail.intakeForm.fields.length > 0 ? (
										<div className="space-y-3">
											{[...detail.intakeForm.fields]
												.sort((a: any, b: any) => a.order - b.order)
												.map((field: any) => {
													const answer =
														(detail.intakeSubmission?.fieldsData?.find(
															(fd: any) => fd.order === field.order,
														)?.value ?? null) as AnswerValue;
													return (
														<div key={field.order} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
															<FormFieldViewer
																field={field}
																answer={answer}
																readOnly={true}
															/>
														</div>
													);
												})}
										</div>
									) : (
										<div className="py-8">
											<EmptyData />
										</div>
									)}
								</div>

								{/* Footer */}
								<div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
									<p className="text-[11px] text-slate-400 flex items-center gap-1.5">
										<Lock className="w-3 h-3" />
										Data pengajuan tidak dapat diubah
									</p>
								</div>
							</div>
						</div>
					)}

					{/* ═══════════════════════════════════════════════════════
					    SECTION 2: LAPORAN PENGERJAAN (Work Report) — List Style
					    ═══════════════════════════════════════════════════════ */}
					{(srStatus === "completed" ||
						srStatus === "partial_completed" ||
						srStatus === "closed") && workReport && workReport.workReportForms.length > 0 && (
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="h-px flex-1 bg-border/60" />
									<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2">
										Laporan Pengerjaan
									</span>
									<div className="h-px flex-1 bg-border/60" />
								</div>

								{/* Section Header */}
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-2">
										<Hammer className="w-4 h-4 text-violet-500" />
										<h3 className="text-sm font-bold text-foreground tracking-tight">
											Laporan Pekerjaan
										</h3>
									</div>
									<Badge
										variant="secondary"
										className="bg-violet-50 text-violet-600 text-xs font-semibold rounded-full px-2.5">
										{workReport?.workReportForms?.length || 0} tahap
									</Badge>
									<div className="flex-1 h-px bg-border/40" />
								</div>

								{/* List Items */}
								{workReport?.workReportForms && workReport.workReportForms.length > 0 ? (
									<div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden divide-y divide-border/30">
										{workReport.workReportForms.map((form, idx) => {
											const submission = workReport.submissions?.find(
												(s) => s.formId === form._id,
											);
											const submittedAt = submission?.createdAt ?? null;

											return (
												<button
													key={form._id}
													type="button"
													onClick={() => handleOpenDrawer(idx)}
													className="group w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-150 text-left cursor-pointer">
													{/* Number badge */}
													<div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-violet-50 text-violet-600 font-bold text-sm border border-violet-100">
														{idx + 1}
													</div>

													{/* Info */}
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground truncate">
																{form.title || `Tahap ${idx + 1}`}
															</span>
														</div>
														<div className="flex items-center gap-3 mt-1">
															{submittedAt && (
																<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
																	<Calendar className="w-3 h-3" />
																	{new Date(submittedAt).toLocaleDateString("id-ID", {
																		day: "numeric",
																		month: "short",
																		year: "numeric",
																	})}
																</span>
															)}

														</div>
													</div>

													{/* Arrow */}
													<ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
												</button>
											);
										})}
									</div>
								) : (
									<EmptyData
										title="Belum Ada Tahap Pengerjaan"
										subtitle="Perusahaan belum membagikan laporan tahap pengerjaan." />
								)}
							</div>
						)}

					{/* ═══════════════════════════════════════════════════════
					    SECTION 3: REVIEW FORM (Formulir Ulasan) — Paling Bawah
					    ═══════════════════════════════════════════════════════ */}
					{detail.reviewForm && (
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<div className="h-px flex-1 bg-border/60" />
								<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2">
									Formulir Ulasan
								</span>
								<div className="h-px flex-1 bg-border/60" />
							</div>

							<div
								className={`rounded-2xl border bg-card shadow-sm overflow-hidden transition-all duration-300 ${detail.reviewSubmission &&
									detail.reviewSubmission.status !== "draft"
									? "border-green-200 shadow-green-50"
									: canFillReview
										? "border-blue-200 shadow-blue-50 ring-2 ring-blue-100"
										: "border-border/60"
									}`}>
								<FormSectionHeader
									type="review"
									title={detail.reviewForm.title}
									description={detail.reviewForm.description}
									isSubmitted={
										!!detail.reviewSubmission &&
										detail.reviewSubmission.status !== "draft"
									}
									canFill={canFillReview}
								/>

								{/* Body */}
								<div className="p-5 space-y-1">
									{detail.reviewForm.fields &&
										detail.reviewForm.fields.length > 0 ? (
										<div className="space-y-3">
											{[...detail.reviewForm.fields]
												.sort((a: any, b: any) => a.order - b.order)
												.map((field: any) => {
													const answer =
														canFillReview
															? (reviewFormData.get(field.order) ?? null)
															: ((detail.reviewSubmission?.fieldsData?.find(
																(fd: any) =>
																	fd.order === field.order,
															)?.value ?? null) as AnswerValue);

													return (
														<div key={field.order} className="pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
															<FormFieldViewer
																field={field}
																answer={answer}
																readOnly={!canFillReview}
																onChange={
																	canFillReview
																		? (value) =>
																			handleReviewFieldChange(
																				field.order,
																				value,
																			)
																		: undefined
																}
															/>
														</div>
													);
												})}
										</div>
									) : (
										<div className="py-8">
											<EmptyData />
										</div>
									)}
								</div>

								{/* Footer */}
								{canFillReview ? (
									<div className="px-5 py-4 border-t border-blue-100 bg-blue-50/40">
										<div className="flex items-center justify-between gap-3">
											<p className="text-[11px] text-blue-500 flex items-center gap-1.5">
												<Star className="w-3 h-3" />
												Berikan penilaian terbaik Anda
											</p>
											<Button
												onClick={() => setConfirmOpen(true)}
												disabled={isSubmittingReview}
												size="sm"
												className="gap-2 rounded-xl px-5 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white shadow-sm">
												<Send className="size-3.5" />
												Kirim Ulasan
											</Button>
										</div>
									</div>
								) : detail.reviewSubmission &&
									detail.reviewSubmission.status !== "draft" ? (
									<div className="px-5 py-3 border-t border-green-100 bg-green-50/50">
										<p className="text-[11px] text-green-600 flex items-center gap-1.5">
											<CheckCircle2 className="w-3 h-3" />
											Ulasan berhasil dikirimkan — terima kasih
										</p>
									</div>
								) : (
									<div className="px-5 py-3 border-t border-border/40 bg-muted/30">
										<p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
											<Timer className="w-3 h-3" />
											Formulir ulasan tersedia setelah layanan selesai
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			}

			{/* ─── Work Report Drawer ─── */}
			<WorkReportDrawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				form={selectedForm}
				submission={selectedSubmission}
				stageIndex={selectedReportIndex}
			/>

			{/* ─── Confirmation Dialog ─── */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-1">
							<div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shrink-0">
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
							className="rounded-lg gap-2 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
							{isSubmittingReview ?
								<>
									<Loader className="size-4 animate-spin" />
									Mengirim...
								</>
								: <>
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
