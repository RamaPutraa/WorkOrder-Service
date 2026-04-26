import { motion, AnimatePresence } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import { CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCompanyApi } from "../../company/services/companyClientService";
import { useNavigate } from "react-router-dom";
import { handleApi } from "@/lib/handle-api";
import { notifyError } from "@/lib/toast-helper";

const DsCompanyList = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const [error, setError] = useState<string | null>(null);
	const [companies, setCompanies] = useState<Company[]>([]);

	const fetchCompanies = async () => {
		setLoading(true);
		setError(null);

		const { data: res, error } = await handleApi(() => getAllCompanyApi());
		setLoading(false);

		if (error) {
			setError(error.message);
			notifyError("Gagal memuat data", error.message);
			return;
		}

		setCompanies(res?.data || []);
	};

	useEffect(() => {
		void fetchCompanies();
	}, []);

	if (error) {
		return (
			<div className="container py-8 px-10">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-600">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Companies Grid */}
			<div className="space-y-4">
				{/* header */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold">Daftar Perusahaan</h1>
						<p className="text-sm text-muted-foreground">
							Daftar perusahaan yang terdaftar di Work Order System.
						</p>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence mode="wait">
						{loading ?
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="col-span-full flex items-center justify-center py-12">
								<SectionLoading message="Memuat data perusahaan..." />
							</motion.div>
						: companies.length === 0 ?
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="col-span-full text-center py-12">
								<Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
								<p className="text-lg font-medium text-gray-600">
									Tidak ada perusahaan ditemukan
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									Coba ubah kata kunci pencarian Anda
								</p>
							</motion.div>
						:	companies.map((company) => (
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
										className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md hover:cursor-pointer transition-all duration-300 overflow-hidden">
										<div className="space-y-4">
											{/* Baris Atas: Icon, Judul, dan Status */}
											<div className="flex items-start justify-between gap-4 px-4 pt-4">
												<div className="p-3 bg-primary/5 text-primary rounded-xl">
													<Building2 className="w-6 h-6 " />
												</div>
												<div className="flex-1 min-w-0">
													<CardTitle className="text-md font-bold truncate">
														{company.name}
													</CardTitle>
													<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
														{company.address || "Tidak ada alamat"}
													</p>
												</div>
											</div>

											{/* Deskripsi - Masuk dalam CardContent atau tetap di Header dengan padding yang pas */}
											<div className="px-4 text-sm text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
												{company.description ||
													"Tidak ada deskripsi tersedia untuk layanan ini."}
											</div>
										</div>

										<div className="flex items-center justify-between gap-1 p-4 border-t border-slate-200/70">
											<div className="text-primary text-xs">Alamat :</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs text-muted-foreground line-clamp-1">
													{company.address || "Tidak ada alamat"}
												</p>
											</div>
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

export default DsCompanyList;
