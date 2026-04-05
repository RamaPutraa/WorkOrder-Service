import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	RefreshCw,
	FileText,
	ArrowRight,
	ChevronLeft,
	Clock,
	CheckCircle2,
	ClipboardPenLine,
	Calendar,
} from "lucide-react";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";
import { getAllClientServiceRequestApi } from "../services/public-services";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/shared/atoms/header-content";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";

const ServiceSubmitPage = () => {
	const [requests, setRequests] = useState<RequesterServiceRequest[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const getAllClientRequests = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() =>
			getAllClientServiceRequestApi(),
		);

		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data layanan", error.message);
			return;
		}

		setRequests(res?.data ?? []);
	};

	useEffect(() => {
		void getAllClientRequests();
	}, []);

	const getStatusBadge = (status: string) => {
		const s = status.toLowerCase();
		if (s === "approved")
			return (
				<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-emerald-600 ">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Disetujui
					</span>
				</div>
			);
		if (s === "rejected")
			return (
				<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-red-600 ">
					<span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-wider">
						Ditolak
					</span>
				</div>
			);
		return (
			<div className="flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full  text-amber-600 ">
				<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
				<span className="text-[10px] font-bold uppercase tracking-wider">
					Menunggu
				</span>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
				<p className="text-muted-foreground">Memuat riwayat permintaan...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center mb-4">{error}</p>
					<Button
						onClick={getAllClientRequests}
						variant="outline"
						className="w-full">
						<RefreshCw className="w-4 h-4 mr-2" />
						Coba Lagi
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}

			<PageHeader
				title="Riwayat Permintaan Layanan"
				subtitle="Berikut merupakan riwayat permintaan layanan yang telah Anda ajukan."
				backPath={true}
			/>

			<div className="w-full">
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
					<AnimatePresence mode="wait">
						{loading ?
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="col-span-full">
								<SectionLoading message="Memuat data pengajuan layanan..." />
							</motion.div>
						: requests.length > 0 ?
							requests.map((item) => (
								<motion.div
									key={item._id}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 2, y: 0 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(`/dashboard/client/submissions/${item._id}`)
										}
										className="group flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
										{/* Header */}
										<div className="border-b border-slate-200/70 p-2">
											{/* Status Badge */}
											<div className="shrink-0">
												{getStatusBadge(item.serviceRequestStatus)}
											</div>
										</div>
										{/* card content 1 */}
										<div className="px-5 py-3 sm:px-6 pt-5 sm:pt-6 space-y-4">
											<div className="flex items-center justify-between gap-3 min-w-0">
												{/* Icon & Title Group */}
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<div className="shrink-0 p-2.5 sm:p-3 bg-primary/5 text-primary rounded-xl">
														<ClipboardPenLine className="w-5 h-5 sm:w-6 sm:h-6" />
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug truncate">
															{item.service?.title || "Untitled Form"}
														</h3>
													</div>
												</div>
											</div>

											<p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 md:min-h-[3.75rem]">
												{item.service?.description ||
													"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
												Lorem ipsum dolor sit amet consectetur adipisicing elit.
												Velit debitis voluptatem molestiae voluptatibus
												repellat? Dicta, minima a beatae voluptas nam eum
												tempora aut enim inventore numquam similique consequatur
												necessitatibus magnam. Porro labore dignissimos
												obcaecati cum earum velit iusto qui adipisci aperiam
												fugiat vel nam molestiae, saepe debitis amet maiores
												tempore! Molestias omnis enim, eius dignissimos tenetur
												quae. Accusantium, animi natus? Ipsam quos rerum
												deleniti quaerat odit temporibus dignissimos quasi
												deserunt quas totam perspiciatis laudantium veniam
												quibusdam, nesciunt dolores aut esse eligendi veritatis
												harum ratione ad minima dicta! Nam, obcaecati
												consequatur.
											</p>
										</div>
										{/* card content 2 */}
										<div className="px-6 py-2 border-t border-slate-200/70 flex flex-col justify-end">
											{/* Info Row (Client & Date) */}
											<div className="flex flex-wrap items-center gap-x-4 text-xs font-semibold text-muted-foreground py-2">
												<div className="flex items-center gap-1.5">
													<Calendar className="w-3.5 h-3.5 shrink-0" />
													<span>
														{new Date(item.createdAt).toLocaleDateString(
															"id-ID",
															{
																day: "2-digit",
																month: "short",
																year: "numeric",
															},
														)}
													</span>
												</div>
											</div>
											{/* Divider */}
										</div>
									</div>
								</motion.div>
							))
						:	<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="col-span-full">
								<SectionLoading message="Memuat data pengajuan layanan..." />
							</motion.div>
						}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default ServiceSubmitPage;
