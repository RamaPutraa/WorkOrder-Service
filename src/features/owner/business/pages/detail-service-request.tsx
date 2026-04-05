import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2, XCircle, Timer } from "lucide-react";
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

const DetailServiceRequest = () => {
	const { detailData: detail, loading } = useBusiness();

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
			{/* Header Section */}
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

			{/* Content Area */}
			{loading || !detail ?
				<SectionLoading message="Memuat detail layanan..." />
			:	<div className="space-y-6">
					{/* Summary Card */}
					<Card className="p-5 lg:p-6 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/20">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-lg bg-primary/10">
								<FileText className="w-6 h-6 text-primary" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-bold mb-1">
									Formulir Pengajuan & Review Layanan
								</h3>
								<p className="text-sm text-muted-foreground">
									Formulir-formulir terkait laporan dan review dari layanan ini
								</p>
							</div>
						</div>
					</Card>

					{/* Accordion for Forms */}
					<Accordion
						type="multiple"
						defaultValue={["intake", "review"]}
						className="space-y-4">
						{formsToRender.map((item) => {
							const { id, label, form, submission } = item;
							const isSubmitted = submission && submission.status !== "draft";

							return (
								<AccordionItem
									key={id}
									value={id}
									className="border rounded-xl shadow-sm overflow-hidden bg-background">
									<AccordionTrigger className="px-5 lg:px-6 py-4 hover:no-underline cursor-pointer hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-muted/30">
										<div className="flex items-center gap-4 flex-1 text-left">
											{/* Status Icon */}
											<div
												className={`p-2 rounded-lg ${
													isSubmitted ?
														"bg-green-100 text-green-600"
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
													isSubmitted ?
														"bg-green-100 text-green-700"
													:	"bg-yellow-100 text-yellow-700"
												}`}>
												{isSubmitted ? "Disubmit" : "Belum Disubmit"}
											</div>
										</div>
									</AccordionTrigger>

									<AccordionContent className="px-5 lg:px-6 pb-5">
										{form?.fields && form.fields.length > 0 ?
											<div className="space-y-3 pt-4">
												{form.fields
													.sort((a: any, b: any) => a.order - b.order)
													.map((field: any) => {
														const answer = submission?.fieldsData?.find(
															(fd: any) => fd.order === field.order,
														)?.value;

														return (
															<div key={field.order} className="pb-4">
																<FormFieldViewer
																	field={field}
																	answer={answer ?? null}
																	readOnly
																/>
															</div>
														);
													})}
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
		</>
	);
};

export default DetailServiceRequest;
