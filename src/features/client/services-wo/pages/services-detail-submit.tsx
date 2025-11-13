import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDetailClientServiceRequestApi } from "../services/public-services";

const ServiceDetailSubmit = () => {
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchDetail = async () => {
			if (!id) return;
			try {
				const data = await getDetailClientServiceRequestApi(id);
				console.log("📦 Detail Client Service Request:", data);
			} catch (error) {
				console.error("❌ Gagal mengambil detail:", error);
			}
		};

		void fetchDetail();
	}, [id]);

	return (
		<>
			<p>test</p>
		</>
	);
};

export default ServiceDetailSubmit;
