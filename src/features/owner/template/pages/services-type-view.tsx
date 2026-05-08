import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Send, Loader2, Eye } from "lucide-react";
import PageHeader from "@/shared/atoms/header-content";
import { useServiceTemplate } from "../hooks/use-service-template";
import { useGenerateTemplate } from "../hooks/use-generate-template";
import { SectionLoading } from "@/shared/atoms";
import { Button } from "@/components/ui/button";
import { TemplatePreviewDialog } from "../components/template-preview-dialog";
import { EmptyData } from "@/shared/molecules/empty-data";

const ServicesTypeView = () => {
	const {
		templates,
		selectedIds,
		loading,
		error,
		companyTypeId,
		toggleSelection,
	} = useServiceTemplate();

	const { generateService, submitting } = useGenerateTemplate();

	const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
		null,
	);

	if (error) {
		return <EmptyData />;
	}

	return (
		<>
			{/* header */}
			<PageHeader
				title="Pilih Template Layanan"
				subtitle="Pilih satu atau beberapa template, lalu klik Gunakan Template."
				backPath={true}
				actionButtons={
					<div className="flex items-center gap-3">
						{selectedIds.length > 0 && (
							<motion.p
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								className="text-sm text-muted-foreground">
								{selectedIds.length} template dipilih
							</motion.p>
						)}
						<Button
							className="rounded-xl h-11 px-8 cursor-pointer gap-2"
							disabled={submitting || selectedIds.length === 0}
							onClick={() => generateService(selectedIds)}>
							{submitting ?
								<Loader2 className="w-4 h-4 animate-spin" />
							:	<Send className="w-4 h-4" />}
							{submitting ? "Memproses..." : "Gunakan Template"}
						</Button>
					</div>
				}
			/>

			<div className="">
				{/* Template List */}
				<AnimatePresence mode="wait">
					{loading ?
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="py-20">
							<SectionLoading message="Memuat template layanan..." />
						</motion.div>
					: templates.length === 0 ?
						<motion.div
							key="empty"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-16 text-slate-400 text-sm">
							{companyTypeId ?
								"Tidak ada template tersedia untuk tipe ini."
							:	"ID tipe perusahaan tidak ditemukan."}
						</motion.div>
					:	<motion.div
							key="list"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
							{templates.map((tmpl, i) => {
								const isSelected = selectedIds.includes(tmpl._id);
								return (
									<motion.div
										key={tmpl._id}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.2,
											delay: i * 0.05,
											ease: "easeOut",
										}}>
										<div
											onClick={() => toggleSelection(tmpl._id)}
											className={`cursor-pointer group relative p-5 flex flex-col h-full bg-white border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden
												${isSelected ? "border-primary ring-4 ring-primary/10 shadow-md" : "border-slate-200/70 hover:border-primary/40 hover:shadow-md"}`}>
											{/* Card content */}
											<div className="py-1">
												<div className="flex items-center gap-4">
													{/* Selection indicator */}
													<div
														className={`size-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
													${isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white group-hover:border-primary/50"}`}>
														{isSelected && (
															<motion.svg
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className="size-3 text-white"
																viewBox="0 0 12 12"
																fill="none">
																<path
																	d="M2 6l3 3 5-5"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</motion.svg>
														)}
													</div>
													<div
														className={`shrink-0 p-3 rounded-xl transition-colors duration-200 hidden md:block
															${isSelected ? "bg-primary/10 text-primary" : "bg-primary/5 text-primary"}`}>
														<FileText className="w-5 h-5" />
													</div>
													<div className="flex-1 space-y-1 min-w-0">
														<h3
															className={`text-sm font-semibold leading-snug  transition-colors
																${isSelected ? "text-primary" : "text-slate-900 group-hover:text-primary"}`}>
															{tmpl.title}
														</h3>
														<p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
															{tmpl.description}
														</p>
													</div>
													{/* Eye button — preview */}
													<Button
														onClick={(e) => {
															e.stopPropagation();
															setPreviewTemplateId(tmpl._id);
														}}
														className=" size-8 rounded-xl flex items-center justify-center text-slate-400 bg-white/80 hover:bg-primary/5 hover:text-primary border border-slate-200/70 hover:border-primary/30 transition-all duration-200 backdrop-blur-sm">
														<Eye className="size-4" />
													</Button>
												</div>
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					}
				</AnimatePresence>
			</div>

			{/* Preview Dialog */}
			<TemplatePreviewDialog
				open={previewTemplateId !== null}
				templateId={previewTemplateId}
				onClose={() => setPreviewTemplateId(null)}
			/>
		</>
	);
};

export default ServicesTypeView;
