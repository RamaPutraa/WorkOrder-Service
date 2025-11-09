import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/use-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";

const DetailForm = () => {
	const navigate = useNavigate();
	const { detailForm } = useForm();

	return (
		<>
			<div className="flex items-center space-x-6 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Detail Form {detailForm?.title}
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan detail form {detailForm?.title} yang dimiliki oleh
						perusahaan.
					</p>
				</div>
			</div>
			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">{detailForm?.title}</h2>
						<p className="text-sm text-muted-foreground">
							{detailForm?.description}
						</p>
					</div>

					<div className="flex gap-2">
						<Button variant="outline" size="sm">
							<Edit className="w-4 h-4 mr-1" /> Edit
						</Button>
						<Button variant="destructive" size="sm">
							<Trash className="w-4 h-4 mr-1" /> Delete
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 ">
					{detailForm?.fields?.map((field, i) => (
						<div key={i} className="space-y-1 border bg-muted rounded-md p-6">
							<Label className="text-sm font-medium">{field.label}</Label>

							{/* tampilkan sesuai type */}
							{field.type === "text" && (
								<input
									type="text"
									placeholder={field.placeholder || "Isian teks"}
									className="text-sm border rounded-md p-2 w-full"
								/>
							)}

							{field.type === "email" && (
								<input
									type="email"
									placeholder={field.placeholder || "Alamat email"}
									className="text-sm border rounded-md p-2 w-full"
								/>
							)}

							{field.type === "number" && (
								<input
									type="number"
									placeholder={field.placeholder || "Isian angka"}
									className="text-sm border rounded-md p-2 w-full"
								/>
							)}

							{field.type === "textarea" && (
								<textarea
									placeholder={field.placeholder || "Area teks"}
									className="text-sm border rounded-md p-2 w-full min-h-[80px]"
								/>
							)}

							{field.type === "single_select" && (
								<div className="text-sm space-y-1">
									<p className="mb-1 italic">Pilihan (radio):</p>
									{field.options?.map((opt, j) => (
										<label key={j} className="flex items-center space-x-2">
											<input
												type="radio"
												name={`field-${i}`}
												value={opt.value}
											/>
											<span>{opt.value}</span>
										</label>
									))}
								</div>
							)}

							{field.type === "multi_select" && (
								<div className="text-sm space-y-1">
									{field.options?.map((opt, j) => (
										<label key={j} className="flex items-center space-x-2">
											<input type="checkbox" value={opt.value} />
											<span>{opt.value}</span>
										</label>
									))}
								</div>
							)}

							{field.type === "date" && (
								<input
									type="date"
									className="text-sm border rounded-md p-2 w-full"
								/>
							)}

							{field.type === "file" && (
								<input
									type="file"
									className="text-sm border rounded-md p-2 w-full"
								/>
							)}
						</div>
					))}
				</CardContent>
			</Card>
		</>
	);
};

export default DetailForm;
