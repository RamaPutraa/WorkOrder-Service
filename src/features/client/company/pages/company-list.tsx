import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import {
	Building2,
	Search,
	ArrowRight,
	Loader2,
	ChevronLeft,
	ScrollText,
	CalendarDays,
	ClipboardList,
	Building,
} from "lucide-react";
import useClientCompanyServices from "../hooks/client-company-services";
import PageHeader from "@/shared/atoms/header-content";
import { EmptyData } from "@/shared/molecules/empty-data";
import { SectionLoading } from "@/shared/atoms";
import { GenericFilter } from "@/shared/molecules/generic-filter";

const CompanyList = () => {
	const { filteredCompanies, loading, error, filterConfigCompanies } =
		useClientCompanyServices();
	const navigate = useNavigate();

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Header */}
				<PageHeader
					title="Daftar Perusahaan"
					subtitle={`Pilih perusahaan untuk melihat layanan - Total ${filteredCompanies.length} perusahaan`}
					backPath={true}
				/>

				<div className="mb-6">
					<GenericFilter config={filterConfigCompanies} />
				</div>

				<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
					<AnimatePresence mode="wait">
						{loading ?
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="col-span-full">
								<SectionLoading message="Memuat data perusahaan..." />
							</motion.div>
						: filteredCompanies.length > 0 ?
							filteredCompanies.map((company) => {
								return (
									<motion.div
										key={company._id}
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, ease: "easeOut" }}>
										<Card className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
											<CardHeader className="px-6  ">
												<div className="flex items-start gap-4">
													{/* Icon */}
													<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
														<Building className="w-6 h-6" />
													</div>

													{/* Text Content */}
													<div className="flex-1 space-y-1">
														<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">
															{company.name || "Untitled Form"}
														</h3>

														<p className="text-sm text-slate-500 leading-relaxed line-clamp-1">
															{company.address || "No description available."}
														</p>
													</div>
												</div>
												<div className="text-sm pt-2 text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
													{company.description ||
														"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
													Lorem ipsum, dolor sit amet consectetur adipisicing
													elit. Asperiores rem dolorum assumenda ipsam
													dignissimos! Doloremque facilis illo porro ipsa
													voluptates neque, repellendus molestiae vel at nulla
													expedita quo doloribus reprehenderit? Ipsam iste ex
													aperiam quam alias, error adipisci consequuntur
													corporis sint perspiciatis dignissimos cupiditate eos!
													Excepturi, consectetur voluptas atque omnis eum
													officia quaerat, quas facere ut eius at. Laborum,
													saepe. Similique voluptate facere autem, assumenda
													pariatur deleniti culpa asperiores molestias
													reprehenderit labore cum dignissimos nulla illo
													delectus iste consequatur nostrum alias. Deserunt
													perferendis autem modi rerum quasi laudantium
													aspernatur. Rem? Dolor voluptatum saepe illo ullam
													possimus expedita tempore voluptate repudiandae iste
													quasi esse similique recusandae, sapiente asperiores
													provident! Commodi sunt quod saepe quisquam veritatis
													accusantium deleniti error facilis enim ducimus.
													Tempore minima alias quis fuga quae vel quidem impedit
													quaerat officia, ex recusandae ab soluta fugit sit
													vero tempora sint blanditiis suscipit vitae
													accusantium cupiditate nostrum possimus. Repellendus,
													saepe beatae? Rerum maxime maiores optio, sed vitae
													veniam harum illo consequatur accusamus, fuga quo
													ducimus esse aperiam sit commodi dolor non eos,
													quisquam nostrum repudiandae autem et sunt quos
													obcaecati. Fugit! Quidem, libero eveniet. Nesciunt
													praesentium autem rerum! Aut deleniti, asperiores
													atque molestias tenetur exercitationem quod possimus
													iure commodi tempore voluptatem, modi qui, dicta neque
													ullam! Doloribus sint quidem repellat fuga! Accusamus
													ipsam quae quaerat vel ab! Autem quo voluptatibus
													blanditiis ad animi exercitationem pariatur, nobis
													doloremque suscipit amet possimus asperiores non
													inventore porro. Corrupti sint eius dicta voluptates,
													nostrum quibusdam. Ut laudantium obcaecati nostrum
													maxime. Ullam magnam adipisci eos reiciendis fugit
													dicta, porro accusantium quisquam deleniti sapiente
													doloremque error dolorum assumenda dolores aliquam
													cupiditate a molestias! Sed alias perferendis debitis?
													Enim eligendi nulla culpa in vero quam debitis maxime
													sequi suscipit aspernatur asperiores rerum ab dolores
													nam, accusantium possimus. Consequatur, quam.
													Obcaecati, vero amet necessitatibus ratione hic
													consequuntur iste neque!
												</div>
											</CardHeader>
											<CardFooter className="grid grid-cols-1 text-xs mx-6 border-t border-slate-200/70 p-0">
												<div className=" flex items-center justify-between text-xs text-slate-400 ">
													<span className="tracking-wide uppercase">
														{/* <Badge variant="outline">
															{serviceTypeLabel(service.accessType)}
														</Badge> */}
													</span>

													{/* Status Dot */}
													<div className="flex items-center gap-2">
														{/* Action */}
														<Button
															variant="outline"
															size="sm"
															className="text-xs rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
															onClick={() =>
																navigate(
																	`/dashboard/client/company/${company._id}/services`,
																)
															}>
															Lihat Detail{" "}
															<ArrowRight className="ml-2 h-4 w-4" />
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
								<EmptyData />
							</motion.div>
						}
					</AnimatePresence>
				</div>
			</div>
		</>
	);
};

export default CompanyList;
