import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { mockServiceTemplates } from "../mock";
import PageHeader from "@/shared/atoms/header-content";

const ServicesTypeView = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const companyTypeId = searchParams.get("companyTypeId") ?? "";

	const templates = mockServiceTemplates[companyTypeId] ?? [];

	return (
		<>
			{/* header */}
			<PageHeader
				title="Pilih Template Layanan"
				subtitle="Pilih template layanan untuk melihat template layanan yang sesuai."
				backPath={true}
			/>
			<div className="">
				{/* Template List */}
				<AnimatePresence mode="wait">
					{templates.length === 0 ?
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-16 text-slate-400 text-sm">
							Tidak ada template tersedia untuk tipe ini.
						</motion.div>
					:	<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
							{templates.map((tmpl) => (
								<motion.div
									key={tmpl._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02, y: -4 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(
												`/dashboard/internal/services/create/service-type/preview?templateId=${tmpl._id}`,
											)
										}
										className="hover:cursor-pointer p-5 group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
										<div className="py-3">
											<div className="flex items-center gap-4">
												{/* Icon */}
												<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
													<FileText className="w-6 h-6" />
												</div>

												{/* Text Content */}
												<div className="flex-1 space-y-1">
													<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">
														{tmpl.title}
													</h3>
													<p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
														{tmpl.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ServicesTypeView;
