import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "../hooks/use-form";

const ViewForm: React.FC = () => {
	const { forms, loading, error } = useForm();
	const navigate = useNavigate();

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
						<h1 className="text-2xl font-bold">List Data Form</h1>
						<p className="text-muted-foreground text-sm sm:text-base">
							Berikut merupakan list form yang dimiliki oleh perusahaan.
						</p>
					</div>
				</div>

				{/* Add Button */}
				<Button
					className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
					onClick={() => navigate("/dashboard/internal/form/create")}>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Form
				</Button>
			</div>

			{/* Main Content - Forms Grid */}
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
										<Skeleton className="h-4 w-2/3 rounded" />
									</div>
									<Skeleton className="h-10 w-full mt-4 rounded-lg" />
								</Card>
							</motion.div>
						))
					: forms.length > 0 ?
						forms.map((form) => (
							<motion.div
								key={form._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.02, y: -4 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<Card className="p-5 flex flex-col justify-between h-full border shadow-md hover:shadow-lg rounded-lg transition-all duration-200 bg-gradient-to-br from-background to-muted/10">
									<div className="space-y-3">
										<h2 className="text-lg font-bold leading-tight">
											{form.title}
										</h2>
										<p
											className="text-sm text-muted-foreground leading-relaxed"
											style={{
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
												overflow: "hidden",
											}}>
											{form.description}
										</p>
										<div className="flex items-center gap-2 pt-1">
											<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
												{form.formType}
											</span>
										</div>
									</div>

									<Button
										asChild
										variant="outline"
										className="mt-4 w-full h-10 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-medium">
										<a href={`/dashboard/internal/form/detail/${form._id}`}>
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
									Tidak ada data form.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									Klik tombol "Tambah Form" untuk membuat form baru.
								</p>
							</Card>
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewForm;
