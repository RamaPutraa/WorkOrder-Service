import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import usePublicService from "../hooks/use-client-service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RequestServicePage() {
	const {
		data,
		loading,
		error,
		isSticky,
		submitting,
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
					isSticky ? "shadow-xl rounded-md" : ""
				}`}>
				<div className="flex items-center justify-between my-5 px-6 py-4 relative z-10">
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
						{submitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Mengirim...
							</>
						) : (
							"Pesan Layanan"
						)}
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				{data.map((item) => (
					<Card key={item._id} className="shadow-sm">
						<CardHeader>
							<h2 className="text-lg font-semibold">{item.title}</h2>
							<p className="text-sm text-muted-foreground">
								{item.description}
							</p>
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
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
										/>
									)}

									{field.type === "email" && (
										<input
											type="email"
											placeholder={field.placeholder || "Alamat email"}
											className="text-sm border rounded-md p-2 w-full"
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
										/>
									)}

									{field.type === "number" && (
										<input
											type="number"
											placeholder={field.placeholder || "Isian angka"}
											className="text-sm border rounded-md p-2 w-full"
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
										/>
									)}

									{field.type === "textarea" && (
										<textarea
											placeholder={field.placeholder || "Area teks"}
											className="text-sm border rounded-md p-2 w-full min-h-[80px]"
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
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
														onChange={(e) =>
															handleChange(
																item._id,
																field.label,
																e.target.value
															)
														}
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
													<input
														type="checkbox"
														value={opt.value}
														onChange={(e) =>
															handleChange(
																item._id,
																field.label,
																e.target.value
															)
														}
													/>
													<span>{opt.value}</span>
												</label>
											))}
										</div>
									)}

									{field.type === "date" && (
										<input
											type="date"
											className="text-sm border rounded-md p-2 w-full"
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
										/>
									)}

									{field.type === "file" && (
										<input
											type="file"
											className="text-sm border rounded-md p-2 w-full"
											onChange={(e) =>
												handleChange(item._id, field.label, e.target.value)
											}
										/>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
