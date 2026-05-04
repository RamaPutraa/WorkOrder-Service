import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { mockCompanyTypes } from "../mock";
import PageHeader from "@/shared/atoms/header-content";

const companyTypeIcons: Record<string, string> = {
	"ct-001": "🏗️",
	"ct-002": "💻",
	"ct-003": "🏭",
	"ct-004": "🏥",
	"ct-005": "🏢",
	"ct-006": "🚛",
};

const CompanyTypeView = () => {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<string | null>(null);

	const handleSelect = (id: string) => {
		setSelected(id);
		setTimeout(() => {
			navigate(
				`/dashboard/internal/services/create/services-type?companyTypeId=${id}`,
			);
		}, 180);
	};

	return (
		<>
			{/* header */}
			<PageHeader
				title="Pilih Tipe Perusahaan"
				subtitle="Pilih tipe perusahaan untuk melihat template layanan yang sesuai."
				backPath={true}
			/>
			<div className="">
				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
					<AnimatePresence mode="wait">
						{mockCompanyTypes.map((ct) => (
							<motion.div
								key={ct._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								whileHover={{ scale: 1.02, y: -4 }}
								transition={{ duration: 0.2, ease: "easeOut" }}>
								<div
									onClick={() => handleSelect(ct._id)}
									className={`group w-full h-full flex flex-col items-center justify-center p-6 rounded-2xl border bg-white transition-all duration-300 cursor-pointer relative overflow-hidden text-center
										${
											selected === ct._id ?
												"border-blue-500 ring-4 ring-blue-50 shadow-lg"
											:	"border-slate-200/70 hover:border-blue-200 hover:shadow-md"
										}`}>
									{/* Background gradient on hover or select */}
									<div
										className={`absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none 
										${selected === ct._id ? "opacity-100" : "group-hover:opacity-100"}`}
									/>

									{/* Icon Container */}
									<div
										className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 relative z-10
										${selected === ct._id ? "bg-blue-50 scale-110" : "bg-primary/5 text-primary group-hover:scale-110 group-hover:-rotate-3"}`}>
										{companyTypeIcons[ct._id] ?? "🏢"}
									</div>

									{/* Content */}
									<div className="relative z-10">
										<h3
											className={`font-semibold text-base transition-colors 
											${selected === ct._id ? "text-blue-700" : "text-slate-900 group-hover:text-blue-600"}`}>
											{ct.companyTypeName}
										</h3>
									</div>

									{/* Selected Indicator */}
									{selected === ct._id && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm z-10">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="w-4 h-4">
												<path
													fillRule="evenodd"
													d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
													clipRule="evenodd"
												/>
											</svg>
										</motion.div>
									)}
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</>
	);
};

export default CompanyTypeView;
