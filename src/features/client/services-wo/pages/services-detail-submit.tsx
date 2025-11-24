import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifyError } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import { getDetailClientServiceRequestApi } from "../services/public-services";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
const ServiceDetailSubmit = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [detail, setDetail] = useState<PublicDetailSubmissions | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchDetail = async () => {
		if (!id) {
			setError("ID pengajuan tidak ditemukan");
			notifyError("Gagal memuat detail", "ID pengajuan tidak ditemukan");
			return;
		}

		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getDetailClientServiceRequestApi(id)
		);

		setLoading(false);

		if (error) {
			console.error("Gagal mengambil detail:", error);
			setError(error.message);
			notifyError("Gagal memuat detail pengajuan", error.message);
			return;
		}

		setDetail(res?.data ?? null);
		console.log("Detail Client Service Request:", res?.data);
	};

	useEffect(() => {
		if (id) fetchDetail();
	}, [id]);

	// --- UI ---
	if (loading) return <p className="p-4">Loading...</p>;
	if (error) return <p className="text-red-500 p-4">{error}</p>;
	if (!detail) return <p className="p-4">Tidak ada data.</p>;

	return (
		<div className="space-y-15 p-6">
			<div className="flex items-center space-x-6 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex flex-col space-y-2">
					<h1 className="text-xl font-bold tracking-tight">
						Detail Service {detail?.service?.title}
					</h1>
					<p className="text-muted-foreground">
						Berikut merupakan detail service {detail?.service?.title} yang
						dimiliki oleh perusahaan.
					</p>
				</div>
			</div>
			{detail.clientIntakeForms.map((item) => {
				const form = item.form;

				const submission = detail.submissions.find(
					(s) => s.formId === form._id
				);

				return (
					<div key={form._id} className="space-y-4">
						{/* ==== CARD FORM HEADER (tidak berisi field) ==== */}
						<Card className="shadow-md border-t-4 border-t-blue-600 rounded-xl">
							<CardHeader>
								<h2 className="text-xl font-semibold">{form.title}</h2>
								<p className="text-sm text-muted-foreground">
									{form.description}
								</p>
							</CardHeader>
						</Card>

						{/* ==== CARD FIELDS (terpisah, bukan di dalam card di atas) ==== */}
						{submission ? (
							form.fields.map((field, i) => {
								const answer = submission.fieldsData.find(
									(fd) => fd.order === field.order
								)?.value;

								return (
									<Card
										key={i}
										className="shadow-sm border rounded-lg p-4 bg-white">
										<div className="space-y-2">
											<Label className="text-sm font-medium">
												{field.label}
											</Label>

											{/* TEXT / EMAIL / NUMBER / PASSWORD */}
											{["text", "email", "password", "number"].includes(
												field.type
											) && (
												<input
													type={field.type}
													value={answer || ""}
													readOnly
													disabled
													className="text-sm border rounded-md p-2 w-full bg-gray-100"
												/>
											)}

											{/* TEXTAREA */}
											{field.type === "textarea" && (
												<textarea
													value={answer || ""}
													readOnly
													disabled
													className="text-sm border rounded-md p-2 w-full min-h-[90px] bg-gray-100"
												/>
											)}

											{/* DATE */}
											{field.type === "date" && (
												<input
													type="date"
													value={answer || ""}
													readOnly
													disabled
													className="text-sm border rounded-md p-2 w-full bg-gray-100"
												/>
											)}

											{/* SINGLE SELECT */}
											{field.type === "single_select" && (
												<div className="text-sm space-y-1">
													{field.options?.map((opt, j) => (
														<label
															key={j}
															className="flex items-center space-x-2">
															<input
																type="radio"
																checked={opt.value === answer}
																disabled
															/>
															<span>{opt.value}</span>
														</label>
													))}
												</div>
											)}

											{/* MULTI SELECT */}
											{field.type === "multi_select" && (
												<div className="text-sm space-y-1">
													{(field.options || []).map((opt, j) => {
														const arr =
															typeof answer === "string"
																? answer.split(",")
																: Array.isArray(answer)
																? answer
																: [];

														return (
															<label
																key={j}
																className="flex items-center space-x-2">
																<input
																	type="checkbox"
																	checked={arr.includes(opt.value)}
																	disabled
																/>
																<span>{opt.value}</span>
															</label>
														);
													})}
												</div>
											)}

											{/* FILE */}
											{field.type === "file" && (
												<input
													type="file"
													disabled
													readOnly
													className="text-sm border rounded-md p-2 w-full bg-gray-100"
												/>
											)}
										</div>
									</Card>
								);
							})
						) : (
							<p className="text-red-500">Belum ada jawaban</p>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default ServiceDetailSubmit;
