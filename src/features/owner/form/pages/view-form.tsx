import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useForm } from "../hooks/use-form";
import PageHeader from "@/shared/atoms/header-content";

const formTypeLabel = (type: string) => {
	switch (type?.toLowerCase()) {
		case "report":
			return "Laporan";
		case "intake":
			return "Pengajuan";
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
			{/* header */}
			<PageHeader
				title="List Data Formulir"
				subtitle="Berikut merupakan list form yang dimiliki oleh perusahaan."
				onAddClick={() => navigate("/dashboard/internal/form/create")}
				addLabel="Tambah Form"
				backPath={true}
			/>

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
							return (
								<motion.div
									key={form._id}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<Card className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
										<CardHeader className="px-6  ">
											<div className="flex items-start gap-4">
												{/* Icon */}
												<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
													<ScrollText className="w-6 h-6" />
												</div>

												{/* Text Content */}
												<div className="flex-1 space-y-1">
													<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">
														{form.title || "Untitled Form"}
													</h3>

													<p className="text-sm text-slate-500 leading-relaxed line-clamp-1">
														{form.description || "No description available."}
													</p>
												</div>
											</div>
										</CardHeader>

										<CardFooter className="px-6 py-2">
											<div className="w-full pt-1 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
												<span className="tracking-wide uppercase">
													<Badge variant="outline">
														{formTypeLabel(form.formType)}
													</Badge>
												</span>

												{/* Status Dot */}
												<div className="flex items-center gap-2">
													{/* Action */}
													<Button
														variant="ghost"
														size="sm"
														className="text-xs rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
														onClick={() =>
															navigate(
																`/dashboard/internal/form/detail/${form._id}`,
															)
														}>
														Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
													</Button>
												</div>
											</div>
										</CardFooter>
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
