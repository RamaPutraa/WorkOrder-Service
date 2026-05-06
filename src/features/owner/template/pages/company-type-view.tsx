import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/shared/atoms/header-content";
import { FileCog } from "lucide-react";
import { useCompanyType } from "../hooks/use-company-type";
import { SectionLoading } from "@/shared/atoms";
import { EmptyData } from "@/shared/molecules/empty-data";

const CompanyTypeView = () => {
	const navigate = useNavigate();
	const { companyTypes, loading, error } = useCompanyType();
	const [selected, setSelected] = useState<string | null>(null);

	const handleSelect = (id: string) => {
		setSelected(id);
		setTimeout(() => {
			navigate(
				`/dashboard/internal/services/create/services-type?companyTypeId=${id}`,
			);
		}, 180);
	};

	if (error) {
		return (
			<div className="container py-8 text-center">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

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
						{loading ?
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="col-span-full py-20">
								<SectionLoading message="Memuat tipe perusahaan..." />
							</motion.div>
						: companyTypes.length === 0 ?
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="col-span-full text-center text-slate-400">
								<EmptyData />
							</motion.div>
						:	companyTypes.map((ct) => (
								<motion.div
									key={ct._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02, y: -4 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() => handleSelect(ct._id)}
										className="group w-full h-full flex flex-col items-center justify-center p-6 rounded-2xl border bg-white transition-all duration-300 cursor-pointer relative overflow-hidden text-center">
										{/* Icon Container */}
										<div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 relative z-10 bg-primary/5 text-primary group-hover:scale-110">
											<FileCog className="w-6 h-6" />
										</div>

										{/* Content */}
										<div className="relative z-10">
											<h3
												className={`font-semibold text-base transition-colors 
											${selected === ct._id ? "text-blue-700" : "text-slate-900 group-hover:text-blue-600"}`}>
												{ct.companyTypeName}
											</h3>
										</div>
									</div>
								</motion.div>
							))
						}
					</AnimatePresence>
				</div>
			</div>
		</>
	);
};

export default CompanyTypeView;
