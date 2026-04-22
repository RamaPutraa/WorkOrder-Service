import { ScrollText, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { useForm } from "../hooks/use-form";
import PageHeader from "@/shared/atoms/header-content";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";

const formTypeLabel = (type: string) => {
	switch (type?.toLowerCase()) {
		case "report":
			return "Laporan";
		case "intake":
			return "Pengajuan";
		case "work_order":
			return "Perintah Kerja";
		case "review":
			return "Ulasan";
		default:
			return type;
	}
};

const ViewForm: React.FC = () => {
	const { loading, error, filterConfig, filteredData } = useForm();
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
				addLabel="Tambah Formulir"
				backPath={true}
			/>

			<div className="mb-6">
				<GenericFilter config={filterConfig} />
			</div>

			{/* Main Content - Forms Grid */}
			<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
					: filteredData.length > 0 ?
						filteredData.map((form) => {
							return (
								<motion.div
									key={form._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02, y: -4 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(`/dashboard/internal/form/detail/${form._id}`)
										}
										className="hover:cursor-pointer p-5 group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
										<div className="py-3">
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
												<span className="tracking-wide uppercase">
													<Badge variant="outline">
														{formTypeLabel(form.formType)}
													</Badge>
												</span>
											</div>
										</div>

										<div className="footer">
											<div className="w-full pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
												{form.createdAt && (
													<div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
														<CalendarDays className="w-3.5 h-3.5 shrink-0" />
														<span>
															{new Date(form.createdAt).toLocaleDateString(
																"id-ID",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})
					:	<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="col-span-full">
							<EmptyData />
						</motion.div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ViewForm;
