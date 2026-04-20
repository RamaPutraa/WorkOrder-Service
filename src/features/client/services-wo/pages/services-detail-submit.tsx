import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import {
	getDetailClientServiceRequestApi,
	submitReviewApi,
} from "../services/public-services";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Timer, Save, Send, Info } from "lucide-react";
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

// ─── Component ────────────────────────────────────────────────────────────────

const ServiceDetailSubmit = () => {
	const { id } = useParams<{ id: string }>();

	const [detail, setDetail] = useState<RequesterSRDetailRequest | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

		const fieldsData: FieldData[] = Array.from(reviewFormData.entries()).map(
			([order, value]) => ({
				order,
				value: (value ?? "") as string | number | string[] | File | null,
			}),
		);

		// Cek semua field terisi (minimal tidak semua kosong)
		const hasAnyFilled = fieldsData.some(
			(fd) => fd.value !== null && fd.value !== "",
		);
		if (!hasAnyFilled) {
			notifyError("Validasi", "Isi minimal satu field pada formulir ulasan.");
			return;
		}

		setIsSubmittingReview(true);
		// TODO:ini beda dari yg lain, next cek
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
					:	`Detail Service ${detail?.service?.title}`
				}
				subtitle={
					!detail ?
						<div className="flex items-center gap-1.5">
							Berikut merupakan detail service{" "}
							<TextLoading variant="dots" message="" className="w-60" />
						</div>
					:	`Berikut merupakan detail service ${detail?.service?.title} yang dimiliki oleh perusahaan.`
				}
				backPath={true}
			/>

			{/* Content */}
			{loading || !detail ?
				<SectionLoading message="Memuat detail pengajuan..." />
			:	<div className="space-y-6">
					{/* Summary Card */}
					<Card className="p-5 lg:p-6 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/20">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<FileText className="w-6 h-6 text-primary" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-bold mb-1">
									Formulir Pengajuan &amp; Review Layanan
								</h3>
								<p className="text-sm text-muted-foreground">
									Formulir-formulir terkait detail dan laporan dari pengajuan
									layanan Anda
								</p>
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
									className="border rounded-xl shadow-sm overflow-hidden bg-background">
									<AccordionTrigger className="px-5 lg:px-6 py-4 hover:no-underline cursor-pointer hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-muted/30">
										<div className="flex items-center gap-4 flex-1 text-left">
											{/* Status Icon */}
											<div
												className={`p-2 rounded-lg ${
													isSubmitted ? "bg-green-100 text-green-600"
													: isReviewItem && canFillReview ?
														"bg-blue-100 text-blue-600"
													:	"bg-yellow-100 text-yellow-700"
												}`}>
												{isSubmitted ?
													<CheckCircle2 className="w-5 h-5" />
												:	<Timer className="w-5 h-5" />}
											</div>

											{/* Form Info */}
											<div className="flex-1 min-w-0">
												<h3 className="text-base font-bold mb-1 truncate">
													{form?.title}{" "}
													<span className="text-sm font-normal text-muted-foreground ml-2">
														({label})
													</span>
												</h3>
												<p className="text-sm text-muted-foreground line-clamp-1">
													{form?.description || "Tidak ada deskripsi"}
												</p>
											</div>

											{/* Badge */}
											<div
												className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
													isSubmitted ? "bg-green-100 text-green-700"
													: isReviewItem && canFillReview ?
														"bg-blue-100 text-blue-700"
													:	"bg-yellow-100 text-yellow-700"
												}`}>
												{isSubmitted ?
													"Disubmit"
												: isReviewItem && canFillReview ?
													"Siap Diisi"
												:	"Belum Disubmit"}
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
									<Save className="size-4 animate-spin" />
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
