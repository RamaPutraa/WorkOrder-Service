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
		<div className="container">
			<div className="flex items-center justify-between mb-8">
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
						<p className="text-muted-foreground">
							Berikut merupakan list service yang dimiliki oleh perusahaan.
						</p>
					</div>
				</div>

				{/* Add Button */}
				<Button
					className="bg-primary hover:bg-primary/90"
					onClick={() => navigate("/dashboard/owner/services/create")}>
					<Plus className="h-4 w-4" />
					Tambah Layanan
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ? (
						Array.from({ length: 6 }).map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<Card className="p-4 flex flex-col justify-between animate-pulse">
									<div>
										<Skeleton className="h-5 w-3/4 mb-3" />
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-2/3" />
									</div>
									<Skeleton className="h-9 w-full mt-4" />
								</Card>
							</motion.div>
						))
					) : services.length > 0 ? (
						services.map((service) => (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.03, y: -4 }}
								transition={{ duration: 0.3, ease: "easeOut" }}>
								<Card className="p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
									{/* Title & Description */}
									<div>
										<h2 className="text-lg font-semibold">{service.title}</h2>
										<p className="text-sm text-muted-foreground mt-1">
											{service.description}
										</p>
									</div>

									{/* Info Bar */}
									<div className="mt-3 space-y-2">
										{/* Access Type */}
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium">Akses:</span>

											{service.accessType === "internal" ? (
												<div className="flex items-center gap-1 text-blue-600">
													<ShieldCheck className="w-4 h-4" />
													<span>Internal</span>
												</div>
											) : (
												<div className="flex items-center gap-1 text-green-600">
													<Globe className="w-4 h-4" />
													<span>Public</span>
												</div>
											)}
										</div>

										{/* Status */}
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium">Status:</span>

											{service.isActive ? (
												<div className="flex items-center gap-1 text-green-600">
													<CheckCircle className="w-4 h-4" />
													<span>Aktif</span>
												</div>
											) : (
												<div className="flex items-center gap-1 text-red-600">
													<XCircle className="w-4 h-4" />
													<span>Nonaktif</span>
												</div>
											)}
										</div>

										{/* Required Staff Count */}
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium">Staff Dibutuhkan:</span>

											<div className="flex items-center gap-1 text-primary">
												<Users className="w-4 h-4" />
												<span>{service.requiredStaff?.length ?? 0} posisi</span>
											</div>
										</div>
									</div>

									{/* Button */}
									<Button
										asChild
										variant="outline"
										className="text-primary border-primary mt-4 w-full">
										<a href={`/dashboard/owner/services/detail/${service._id}`}>
											Lihat Detail
										</a>
									</Button>
								</Card>
							</motion.div>
						))
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full text-center py-10 text-muted-foreground">
							Tidak ada data service tersedia.
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ViewService;
