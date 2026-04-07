import { CheckCircle2, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useServices } from "../hooks/useServices";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";
import PageHeader from "@/shared/atoms/header-content";
import { SectionLoading } from "@/shared/atoms";
import { EmptyData } from "@/shared/molecules/empty-data";
import { TextLoading } from "@/shared/atoms/loading-state";

export default function ServiceForm() {
	const {
		intakeForm,
		loading,
		error,
		isSticky,
		formValues,
		handleChange,
		handleSubmit,
		submitting,
	} = useServices();

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<>
			<PageHeader
				title="Formulir Layanan"
				subtitle="Berikut merupakan formulir layanan yang perlu diisi."
				backPath={true}
				addIcon={<CheckCircle2 className="size-6" />}
				addLabel="Pesan Layanan"
				onAddClick={() => handleSubmit()}
				loading={submitting}
				className={`sticky top-0 z-30 bg-background transition-shadow duration-300 ${
					isSticky ? "shadow-xl rounded-md px-6 py-4" : ""
				}`}
			/>
			<Card className="p-5 lg:p-6 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/20 my-2">
				<div className="flex items-start gap-4">
					<div className="p-3 rounded-lg bg-primary/10">
						<ScrollText className="w-6 h-6 text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-bold mb-1">
							{loading ?
								<span className="flex items-center gap-1.5">
									Formulir{" "}
									<TextLoading variant="dots" message="" className="w-40" />
								</span>
							:	`Formulir ${intakeForm?.title || ""}`}
						</h3>
						<p className="text-sm text-muted-foreground">
							{loading ?
								<span className="flex items-center gap-1.5">
									<TextLoading variant="dots" message="" className="w-40" />
								</span>
							:	`${intakeForm?.description || ""}`}
						</p>
					</div>
				</div>
			</Card>
			{loading ?
				<SectionLoading message="Memuat formulir..." />
			: intakeForm ?
				<div className="space-y-3">
					<div className="space-y-3">
						{intakeForm.fields
							?.sort((a, b) => a.order - b.order)
							.map((field) => {
								const currentValue =
									formValues[intakeForm._id]?.[field.order] ?? null;

								return (
									<div key={field.order} className="pb-2">
										<FormFieldViewer
											field={field}
											answer={currentValue as AnswerValue}
											readOnly={false}
											onChange={(value) =>
												handleChange(intakeForm._id, field.order, value)
											}
										/>
									</div>
								);
							})}
					</div>
				</div>
			:	<EmptyData />}
		</>
	);
}
