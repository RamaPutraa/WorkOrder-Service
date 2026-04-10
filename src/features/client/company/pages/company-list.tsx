import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { Building, MapPinHouse } from "lucide-react";
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
										<div
											onClick={() =>
												navigate(
													`/dashboard/client/company/${company._id}/services`,
												)
											}
											className="gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group ">
											<div className="px-6  ">
												<div className="flex items-center gap-4 py-5">
													{/* Icon */}
													<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
														<Building className="w-6 h-6" />
													</div>

													{/* Text Content */}

													<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">
														{company.name || "Untitled Form"}
													</h3>
												</div>
												<div className="text-sm  text-slate-500 leading-relaxed line-clamp-3 text-justify">
													{company.description ||
														"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
													Lorem ipsum dolor sit, amet consectetur adipisicing
													elit. Non perspiciatis fuga laboriosam laborum
													possimus ipsa velit aliquam nisi blanditiis,
													voluptatum at dolore omnis animi voluptas eos beatae
													quaerat. Impedit, perferendis. Ratione et reiciendis
													eveniet magni cum quos minus mollitia? Quam dolores at
													iure blanditiis incidunt quibusdam, voluptatum est
													soluta ipsum dolorem, quia enim delectus perspiciatis
													corporis inventore et. Vitae, unde! Architecto rem,
													iure atque fugiat saepe nulla nihil autem sint ipsa
													asperiores alias quasi doloribus inventore odit
													repellat, magnam eligendi esse dolor quibusdam
													expedita voluptates corrupti aliquid dolore. Dolorum,
													harum.
												</div>
											</div>
											<div className="grid grid-cols-1 text-xs border-t border-slate-200/70 px-4 py-2">
												<div className=" flex items-center justify-start text-xs text-slate-400 ">
													<span className="tracking-wide uppercase">
														{/* <Badge variant="outline">
															{serviceTypeLabel(service.accessType)}
														</Badge> */}
													</span>

													{/* Status Dot */}
													<div className="flex items-center gap-2">
														<div className="flex items-center">
															<div className="shrink-0 p-3  rounded-xl flex items-center gap-2">
																<MapPinHouse className="w-5 h-5 text-primary" />{" "}
																Alamat :
															</div>
														</div>
														<p className="text-sm text-slate-500 leading-relaxed line-clamp-1">
															{company.address || "No description available."}
														</p>
													</div>
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
			</div>
		</>
	);
};

export default CompanyList;
