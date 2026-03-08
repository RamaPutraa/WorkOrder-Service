import { Button } from "@/components/ui/button";
import { useForm } from "../hooks/use-form";
import { Card } from "@/components/ui/card";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";
import { Edit, Trash } from "lucide-react";

const DetailForm = () => {
	const { detailForm, loading } = useForm();

	return (
		<>
			{/* header */}
			<PageHeader
				title={
					loading ?
						<div className="flex items-center gap-1.5">
							Detail Formulir{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Detail Formulir ${detailForm?.title}`
				}
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Berikut merupakan detail formulir{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Berikut merupakan detail formulir ${detailForm?.title} `
				}
				backPath={true}
			/>

			{/* Main Content - Form Details */}
			{loading ?
				<SectionLoading message="Memuat detail form..." />
			:	<Card className="shadow-md border rounded-lg overflow-hidden">
					{/* Card Header with Actions */}
					<div className="p-5 lg:p-6 border-b bg-gradient-to-br from-background to-muted/20">
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
							<div className="flex-1">
								<h2 className="text-xl font-bold mb-2">{detailForm?.title}</h2>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{detailForm?.description}
								</p>
							</div>

							<div className="flex gap-2 sm:flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 sm:flex-none h-10 px-4 rounded-lg border-2 hover:bg-muted transition-colors">
									<Edit className="w-4 h-4 sm:mr-2" />
									<span className="hidden sm:inline">Edit</span>
								</Button>
								<Button
									variant="destructive"
									size="sm"
									className="flex-1 sm:flex-none h-10 px-4 rounded-lg transition-colors">
									<Trash className="w-4 h-4 sm:mr-2" />
									<span className="hidden sm:inline">Delete</span>
								</Button>
							</div>
						</div>
					</div>

					{/* Form Fields */}
					<div className="p-5 lg:p-6">
						<div className="space-y-4">
							{detailForm?.fields?.map((field, i) => (
								<div
									key={i}
									className="p-4 lg:p-5 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
									<FormFieldViewer field={field} answer={null} readOnly />
								</div>
							))}
						</div>
					</div>
				</Card>
			}
		</>
	);
};

export default DetailForm;
