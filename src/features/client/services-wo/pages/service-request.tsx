import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import usePublicService from "../hooks/use-client-service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";

export default function RequestServicePage() {
	const {
		data,
		loading,
		error,
		isSticky,
		submitting,
		formValues,
		handleChange,
		handleSubmit,
	} = usePublicService();

	const navigate = useNavigate();

	if (loading)
		return (
			<div className="flex items-center justify-center h-40">
				<Loader2 className="animate-spin" />
				<span className="ml-2">Memuat data...</span>
			</div>
		);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<>
			<div
				className={`sticky top-0 z-30 bg-background transition-shadow duration-300 ${
					isSticky ? "shadow-xl rounded-md px-6 py-4" : ""
				}`}>
				<div className="flex items-center justify-between my-5  relative z-10">
					<div className="flex items-center space-x-6">
						<Button
							onClick={() => navigate(-1)}
							className="bg-primary hover:bg-primary/90 h-full">
							<ChevronLeft className="size-6" />
						</Button>
						<div className="flex flex-col space-y-2">
							<h1 className="text-xl font-bold tracking-tight">
								Layanan Perusahaan
							</h1>
							<p className="text-muted-foreground">
								Berikut merupakan layanan yang dimiliki oleh perusahaan.
							</p>
						</div>
					</div>

					<Button
						className="bg-primary hover:bg-primary/90"
						onClick={() => handleSubmit()}
						disabled={submitting}>
						{submitting ?
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Mengirim...
							</>
						:	"Pesan Layanan"}
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				{data.map((form) => (
					<Card key={form._id} className="shadow-sm">
						<CardHeader>
							<h2 className="text-lg font-semibold">{form.title}</h2>
							<p className="text-sm text-muted-foreground">
								{form.description}
							</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{form.fields
								?.sort((a, b) => a.order - b.order)
								.map((field) => {
									// Get current value from formValues state
									const currentValue =
										formValues[form._id]?.[field.order] ?? null;

									return (
										<Card
											key={field.order}
											className="shadow-sm border rounded-lg p-4 bg-white">
											<FormFieldViewer
												field={field}
												answer={currentValue as AnswerValue}
												readOnly={false}
												onChange={(value) =>
													handleChange(form._id, field.order, value)
												}
											/>
										</Card>
									);
								})}
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
