import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyData } from "@/shared/molecules/empty-data";
import { FileText, Save } from "lucide-react";

export const WoFormInfo = ({ wo }: { wo: any }) => {
	return (
		<Card className="border shadow-sm rounded-xl">
			<CardHeader className="pb-2 border-b border-border/50">
				<div className="flex items-center gap-4">
					<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
						<FileText className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-md font-bold text-foreground leading-tight">
							{wo.workOrderForm?.title || "—"}
						</h2>
						<p className="text-sm text-muted-foreground mt-0.5">
							{wo.workOrderForm?.description || "—"}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{wo.workOrderForm ?
					<>
						{/* Fields — rendered with FormFieldViewer in readOnly mode */}
						{wo.workOrderForm.fields.length > 0 ?
							<div className="space-y-3 mt-4">
								{wo.workOrderForm.fields.map((field: any, idx: number) => {
									const submission = wo.submissions?.find(
										(sub: any) => sub.formId === wo.workOrderForm?._id,
									);
									const fieldData = submission?.fieldsData?.find(
										(fd: any) => fd.order === field.order,
									);
									const answer = fieldData ? fieldData.value : null;

									return (
										<FormFieldViewer
											key={idx}
											field={field}
											answer={answer}
											index={idx + 1}
										/>
									);
								})}
							</div>
						:	<div className="mt-4"><EmptyData /></div>}
					</>
				:	<EmptyData />}

				<Separator />
				<Button className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 w-full md:w-auto text-white rounded-xl px-5 h-9 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
					<Save className="w-4 h-4" />
					<span className="font-semibold text-sm">Simpan</span>
				</Button>
			</CardContent>
		</Card>
	);
};
