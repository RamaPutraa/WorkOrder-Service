import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifyError } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import { getDetailClientServiceRequestApi } from "../services/public-services";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import FormFieldViewer, {
	type AnswerValue,
} from "@/shared/molecules/form-field-viewer";

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
			getDetailClientServiceRequestApi(id),
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
					(s) => s.formId === form._id,
				);

				return (
					<div key={form._id} className="space-y-4">
						{/* ==== CARD FORM HEADER ==== */}
						<Card className="shadow-md border-t-4 border-t-blue-600 rounded-xl">
							<CardHeader>
								<h2 className="text-xl font-semibold">{form.title}</h2>
								<p className="text-sm text-muted-foreground">
									{form.description}
								</p>
							</CardHeader>
						</Card>

						{/* ==== CARD FIELDS using FormFieldViewer ==== */}
						{submission ?
							form.fields
								.sort((a, b) => a.order - b.order)
								.map((field) => {
									const answer = submission.fieldsData.find(
										(fd) => fd.order === field.order,
									)?.value;

									return (
										<Card
											key={field.order}
											className="shadow-sm border rounded-lg p-4 bg-white">
											<FormFieldViewer
												field={field}
												answer={(answer ?? null) as AnswerValue}
												readOnly={true}
											/>
										</Card>
									);
								})
						:	<p className="text-red-500">Belum ada jawaban</p>}
					</div>
				);
			})}
		</div>
	);
};

export default ServiceDetailSubmit;
