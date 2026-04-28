import { Card } from "@/components/ui/card";
import {
	FileText,
	CheckCircle2,
	Timer,
	XCircle,
	Check,
	User,
	Calendar,
	Tag,
} from "lucide-react";
import { useBusiness } from "../hooks/use-business";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/store/dialogStore";
import { SrStatusStepper } from "../components/sr-status-stepper";
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
		className: "bg-zinc-100 text-zinc-600 border-zinc-200",
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

const DetailServiceRequest = () => {
	const {
		detailData: detail,
		loading,
		handleApprove,
		handleReject,
	} = useBusiness();
	const { showDialog } = useDialogStore();

	const formsToRender =
		detail ?
			[
				{
					id: "intake",
					label: "Formulir Pengajuan",
					form: detail.intakeForm,
					submission: detail.intakeSubmission,
				},
				{
					id: "review",
					label: "Formulir Ulasan",
					form: detail.reviewForm,
					submission: detail.reviewSubmission,
				},
			].filter((item) => item.form)
		:	[];

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
					:	`Berikut merupakan detail service ${detail?.service?.title} yang dimiliki oleh perusahaan.`
				}
				backPath={true}
				actionButtons={
					<>
						{detail?.serviceRequestStatus === "received" ?
							<>
								<Button
									size="sm"
									className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										showDialog({
											title: "Konfirmasi Penolakan",
											description:
												"Apakah kamu yakin ingin menolak layanan ini?",
											confirmText: "Tolak",
											cancelText: "Batal",
											onConfirm: () => handleReject(detail!._id),
										});
									}}>
									<XCircle className="w-4 h-4 shrink-0" />
									<span>Tolak</span>
								</Button>
								<Button
									size="sm"
									className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										showDialog({
											title: "Konfirmasi Persetujuan",
											description:
												"Apakah kamu yakin ingin menyetujui layanan ini?",
											confirmText: "Setujui",
											cancelText: "Batal",
											onConfirm: () => handleApprove(detail!._id),
										});
									}}>
									<Check className="w-4 h-4 shrink-0" />
									<span>Setujui</span>
								</Button>
							</>
						:	null}
					</>
				}
			/>

			{/* Content */}
			{loading || !detail ?
				<SectionLoading message="Memuat detail layanan..." />
			:	<div className="space-y-5">
					{/* sumamry */}
					<Card className="relative overflow-hidden border border-border shadow-sm transition-all duration-200 hover:shadow-md">
						<div className="p-5 sm:p-6 flex flex-col gap-6">
							{/* 1. HEADER: Icon, Title, Description & Badge */}
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="flex items-start gap-4">
									{/* Icon Box: Sedikit dipertegas dengan border dan shadow tipis */}
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

							{/* 2. META INFO: Dikelompokkan dalam box berlatar lembut */}
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

								{/* Titik Pemisah (Hanya tampil di layar agak besar) */}
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
								{/* Label */}
								<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
									Status Progress
								</p>

								{/* Mobile: status badge only */}
								<div className="sm:hidden">
									<StatusBadge status={detail.serviceRequestStatus} />
								</div>

								{/* Desktop: full stepper */}
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

					{/* ── Forms Accordion ── */}
					{formsToRender.length > 0 && (
						<Accordion
							type="multiple"
							defaultValue={["intake", "review"]}
							className="space-y-3">
							{formsToRender.map((item) => {
								const { id, label, form, submission } = item;
								const isSubmitted = submission && submission.status !== "draft";

								return (
									<AccordionItem
										key={id}
										value={id}
										className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-sm data-[state=open]:border-primary/20 transition-all duration-200">
										<AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/40 transition-colors cursor-pointer [&[data-state=open]]:bg-muted/20">
											<div className="flex items-center gap-4 flex-1 text-left">
												{/* Icon */}
												<div
													className={`shrink-0 p-2 rounded-lg transition-colors ${
														isSubmitted ?
															"bg-emerald-50 text-emerald-600"
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
														isSubmitted ?
															"bg-emerald-50 text-emerald-700"
														:	"bg-amber-50 text-amber-700"
													}`}>
													<div
														className={`w-1.5 h-1.5 rounded-full ${
															isSubmitted ? "bg-emerald-500" : "bg-amber-400"
														}`}
													/>
													{isSubmitted ? "Disubmit" : "Menunggu"}
												</div>
											</div>
										</AccordionTrigger>

										<AccordionContent className="px-6 pb-6">
											{form?.fields && form.fields.length > 0 ?
												<div className="space-y-4 pt-5">
													{form.fields
														.sort((a: any, b: any) => a.order - b.order)
														.map((field: any) => {
															const answer = submission?.fieldsData?.find(
																(fd: any) => fd.order === field.order,
															)?.value;
															return (
																<div key={field.order}>
																	<FormFieldViewer
																		field={field}
																		index={field.order}
																		answer={answer ?? null}
																		readOnly
																	/>
																</div>
															);
														})}
												</div>
											:	<div className="pt-5">
													<EmptyData />
												</div>
											}
										</AccordionContent>
									</AccordionItem>
								);
							})}
						</Accordion>
					)}
				</div>
			}
		</>
	);
};

export default DetailServiceRequest;
