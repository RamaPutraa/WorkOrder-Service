import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	CheckCircle,
	ChevronLeft,
	Globe,
	Plus,
	ShieldCheck,
	Users,
	XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateService } from "../hooks/useCreateService";

const ViewService: React.FC = () => {
	const navigate = useNavigate();
	const { fecthServices, services, loading, error } = useCreateService();

	useEffect(() => {
		void fecthServices();
	}, []);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
				<div className="flex items-center space-x-4">
					{/* Back Button */}
					<Button
						onClick={() => navigate(-1)}
						className="bg-primary hover:bg-primary/90 h-full">
						<ChevronLeft className="size-6" />
					</Button>

					{/* Title Section */}
					<div className="flex flex-col space-y-1">
						<h1 className="text-2xl font-bold">List Data Service</h1>
						<p className="text-muted-foreground text-sm sm:text-base">
							Berikut merupakan list service yang dimiliki oleh perusahaan.
						</p>
					</div>
				</div>

				{/* Add Button */}
				<Button
					className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
					onClick={() => navigate("/dashboard/internal/services/create")}>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Layanan
				</Button>
			</div>

			{/* Main Content - Services Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ?
						Array.from({ length: 6 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<Card className="p-5 flex flex-col justify-between border shadow-sm rounded-lg">
									<div>
										<Skeleton className="h-6 w-3/4 mb-3 rounded" />
										<Skeleton className="h-4 w-full mb-2 rounded" />
										<Skeleton className="h-4 w-2/3 mb-4 rounded" />
										<Skeleton className="h-16 w-full rounded" />
									</div>
									<Skeleton className="h-10 w-full mt-4 rounded-lg" />
								</Card>
							</motion.div>
						))
					: services.length > 0 ?
						services.map((service) => (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.02, y: -4 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<Card className="p-5 flex flex-col justify-between h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10">
									{/* Title & Description */}
									<div className="space-y-3">
										<h2 className="text-lg font-bold leading-tight">
											{service.title}
										</h2>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{service.description}
										</p>

										{/* Info Badges */}
										<div className="flex flex-wrap gap-2 pt-2">
											{/* Access Type Badge */}
											{service.accessType === "internal" ?
												<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
													<ShieldCheck className="w-3.5 h-3.5" />
													<span className="text-xs font-semibold">
														Internal
													</span>
												</div>
											:	<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200">
													<Globe className="w-3.5 h-3.5" />
													<span className="text-xs font-semibold">Public</span>
												</div>
											}

											{/* Status Badge */}
											{service.isActive ?
												<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 border border-green-200">
													<CheckCircle className="w-3.5 h-3.5" />
													<span className="text-xs font-semibold">Aktif</span>
												</div>
											:	<div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200">
													<XCircle className="w-3.5 h-3.5" />
													<span className="text-xs font-semibold">
														Nonaktif
													</span>
												</div>
											}
										</div>

										{/* Staff Required */}
										<div className="flex items-center gap-2 pt-1">
											<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
												<Users className="w-4 h-4" />
												<span className="font-medium">
													{service.requiredStaffs?.length ?? 0} posisi staff
												</span>
											</div>
										</div>
									</div>

									{/* Button */}
									<Button
										asChild
										variant="outline"
										className="mt-4 w-full h-10 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium">
										<a
											href={`/dashboard/internal/services/detail/${service._id}`}>
											Lihat Detail
										</a>
									</Button>
								</Card>
							</motion.div>
						))
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<Card className="p-12 text-center border-dashed border-2 rounded-lg">
								<p className="text-muted-foreground text-base">
									Tidak ada data service tersedia.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									Klik tombol "Tambah Layanan" untuk membuat service baru.
								</p>
							</Card>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewService;
