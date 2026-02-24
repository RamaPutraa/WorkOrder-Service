import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useBusiness } from "../hooks/use-business";
import { useNavigate } from "react-router-dom";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionLoading } from "@/shared/atoms";

const DetailServiceRequest = () => {
	const { detailData: detail, loading } = useBusiness();
	const navigate = useNavigate();

	return (
		<>
			{/* Header Section */}
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold">
						Detail Service {detail?.service?.title}
					</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Berikut merupakan detail service {detail?.service?.title} yang
						dimiliki oleh perusahaan.
					</p>
				</div>
			</div>

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
									Formulir Pengajuan Layanan
								</h3>
								<p className="text-sm text-muted-foreground">
									Total {detail.clientIntakeForms.length} formulir telah diisi
									oleh klien
								</p>
							</div>
						</div>
					</Card>

					{/* Accordion for Forms */}
					<Accordion
						type="multiple"
						defaultValue={detail.clientIntakeForms.map((_, i) => `form-${i}`)}
						className="space-y-4">
						{detail.clientIntakeForms.map((item, index) => {
							const form = item.form;
							const submission = detail.submissions.find(
								(s) => s.formId === form._id,
							);
							const hasSubmission = !!submission;

							return (
								<AccordionItem
									key={form._id}
									value={`form-${index}`}
									className="border rounded-xl shadow-sm overflow-hidden bg-background">
									<AccordionTrigger className="px-5 lg:px-6 py-4 hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-muted/30">
										<div className="flex items-center gap-4 flex-1 text-left">
											{/* Status Icon */}
											<div
												className={`p-2 rounded-lg ${
													hasSubmission ?
														"bg-green-50 text-green-600"
													:	"bg-red-50 text-red-600"
												}`}>
												{hasSubmission ?
													<CheckCircle2 className="w-5 h-5" />
												:	<XCircle className="w-5 h-5" />}
											</div>

											{/* Form Info */}
											<div className="flex-1 min-w-0">
												<h3 className="text-base font-bold mb-1 truncate">
													{form.title}
												</h3>
												<p className="text-sm text-muted-foreground line-clamp-1">
													{form.description}
												</p>
											</div>

											{/* Badge */}
											<div
												className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
													hasSubmission ?
														"bg-green-100 text-green-700"
													:	"bg-red-100 text-red-700"
												}`}>
												{hasSubmission ? "Terisi" : "Belum Terisi"}
											</div>
										</div>
									</AccordionTrigger>

									<AccordionContent className="px-5 lg:px-6 pb-5">
										{hasSubmission && submission ?
											<div className="space-y-3 pt-4">
												{form.fields
													.sort((a, b) => a.order - b.order)
													.map((field) => {
														const answer = submission.fieldsData.find(
															(fd) => fd.order === field.order,
														)?.value;

														return (
															<div
																key={field.order}
																className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
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
												<Card className="p-6 text-center border-dashed border-2">
													<div className="flex flex-col items-center gap-2">
														<XCircle className="w-8 h-8 text-muted-foreground/50" />
														<p className="text-sm text-muted-foreground font-medium">
															Belum ada jawaban untuk formulir ini
														</p>
													</div>
												</Card>
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
