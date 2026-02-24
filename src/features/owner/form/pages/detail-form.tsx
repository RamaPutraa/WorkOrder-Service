import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/use-form";
import { Card } from "@/components/ui/card";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { SectionLoading } from "@/shared/atoms";

const DetailForm = () => {
	const navigate = useNavigate();
	const { detailForm, loading } = useForm();

	return (
		<>
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full shrink-0">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">
						Detail Formulir {detailForm?.title}
					</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Berikut merupakan detail formulir {detailForm?.title}.
					</p>
				</div>
			</div>

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
