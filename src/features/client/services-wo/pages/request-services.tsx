import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import usePublicServiceDetail from "../hooks/use-client-service";

export default function PublicServicePage() {
	const { data, loading, error } = usePublicServiceDetail();

	if (loading)
		return (
			<div className="flex items-center justify-center h-40">
				<Loader2 className="animate-spin" />
				<span className="ml-2">Memuat data...</span>
			</div>
		);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="space-y-6 p-4">
			{data.map((item) => (
				<Card key={item._id} className="shadow-sm">
					<CardHeader>
						<h2 className="text-lg font-semibold">{item.title}</h2>
						<p className="text-sm text-muted-foreground">{item.description}</p>
					</CardHeader>
					<CardContent className="space-y-4">
						{item.fields?.map((field, i) => (
							<div key={i} className="space-y-1">
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
			))}
		</div>
	);
}
