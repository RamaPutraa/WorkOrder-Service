import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useForm } from "../hooks/use-form";

const formTypeLabel = (type: string) => {
	switch (type?.toLowerCase()) {
		case "report":
			return "Laporan";
		case "intake":
			return "Pelanggan";
		case "work_order":
			return "Perintah Kerja";
		default:
			return type;
	}
};

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
			{/* Header Section */}
			<div className="flex items-center gap-4 mb-8">
				<Button
					onClick={() => navigate(-1)}
					className="bg-primary hover:bg-primary/90 h-full shrink-0">
					<ChevronLeft className="size-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">List Data Formulir</h1>
					<p className="text-muted-foreground text-sm mt-0.5">
						Berikut merupakan list form yang dimiliki oleh perusahaan.
					</p>
				</div>

				{/* Add Button */}
				<Button
					className="bg-primary hover:bg-primary/90 "
					onClick={() => navigate("/dashboard/internal/form/create")}>
					<Plus className="h-4 w-4 mr-2" />
					Tambah Form
				</Button>
			</div>

			{/* Main Content - Forms Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="col-span-full">
							<SectionLoading message="Memuat data form..." />
						</motion.div>
					: forms.length > 0 ?
						forms.map((form) => {
							const fieldCount = form.fields?.length ?? 0;
							return (
								<motion.div
									key={form._id}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<Card className="flex flex-col h-full border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
										{/* Top bar */}
										{/* <div className="h-0.5 w-full bg-border group-hover:bg-primary transition-colors duration-200" /> */}

										<CardHeader className="pt-5 px-5">
											<div className="flex items-start justify-between gap-2">
												<h2 className="text-base font-semibold leading-snug line-clamp-2">
													{form.title}
												</h2>
												<span className="shrink-0 text-xs font-medium text-muted-foreground border rounded-full px-2.5 py-0.5 mt-0.5">
													{formTypeLabel(form.formType)}
												</span>
											</div>
										</CardHeader>

										<CardContent className="flex flex-col flex-1 gap-4 px-5 pb-5 pt-0">
											<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
												{form.description || "Tidak ada deskripsi."}
											</p>

											<div className="flex items-center justify-between pt-3 border-t">
												<span className="text-sm text-muted-foreground">
													{fieldCount} field
												</span>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														navigate(
															`/dashboard/internal/form/detail/${form._id}`,
														)
													}>
													Lihat Detail
													<ChevronLeft className="w-4 h-4 rotate-180 ml-1" />
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})
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
