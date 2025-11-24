import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notifyError } from "@/lib/toast-helper";
import { handleApi } from "@/lib/handle-api";
import { getDetailClientServiceRequestApi } from "../services/public-services";

const ServiceDetailSubmit = () => {
	const { id } = useParams<{ id: string }>();

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

	return (
		<div className="p-4">
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{!loading && detail && (
				<div>
					<h1 className="text-xl font-semibold mb-2">Detail Pengajuan</h1>
					<p>Status: {detail.status}</p>
					<p>Dibuat: {detail.createdAt}</p>
					<p>Service: {detail.service?.title}</p>

					{/* kamu tinggal render intake forms nya di sini */}
					{/* contoh:
					<div>
						{detail.clientIntakeForms?.map((f) => (
							<div key={f._id}>{f.form?.title}</div>
						))}
					</div>
					*/}
				</div>
			)}

			{!loading && !detail && !error && <p>Tidak ada data.</p>}
		</div>
	);
};

export default ServiceDetailSubmit;
