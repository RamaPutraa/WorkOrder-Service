import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
	Building2,
	MapPin,
	CheckCircle2,
	XCircle,
	ClipboardList,
} from "lucide-react";
import useClientCompany from "../hooks/client-company-services";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { SectionLoading, FullPageLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { FaqChatbot } from "@/shared/organism/faq-chatbot";
import { usePairingAccount } from "@/features/client/pairing-account/hooks/use-pairing-account";
import { getPairedAccountInCompany } from "@/features/client/pairing-account/services/pairing-account";
import { useDialogStore } from "@/store/dialogStore";
const ClientCompanyServices = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showDialog } = useDialogStore();
	const {
		isPairing,
		isDetaching,
		localPaired,
		initiatePairing,
		detachAccount,
	} = usePairingAccount();
	const {
		filteredServices,
		filterConfigServices,
		companyDetail: company,
		isSubscribed,
		isIntegrationActive,
		loading,
		error,
		fetchCompanyServices,
		fetchCompanyDetail,
	} = useClientCompany();
	const [externalAccount, setExternalAccount] =
		useState<ExternalAccount | null>(null);
	const [localUnsubscribed, setLocalUnsubscribed] = useState(false);

	// Visual status: if it was already subscribed or newly paired in this session
	const isPaired = (isSubscribed && !localUnsubscribed) || localPaired;

	useEffect(() => {
		if (isPaired && id) {
			getPairedAccountInCompany(id)
				.then((res) => {
					if (res.data) {
						setExternalAccount(res.data);
					}
				})
				.catch(console.error);
		} else {
			setExternalAccount(null);
		}
	}, [isPaired, id]);

	useEffect(() => {
		if (localPaired) {
			setLocalUnsubscribed(false);
		}
	}, [localPaired]);

	useEffect(() => {
		if (localPaired) {
			void fetchCompanyServices();
			void fetchCompanyDetail();
		}
	}, [localPaired, fetchCompanyServices, fetchCompanyDetail]);

	const handlePairing = () => {
		if (company?._id) {
			initiatePairing(company._id);
		}
	};

	const handleDetach = () => {
		if (externalAccount?._id && company) {
			showDialog({
				title: "Putuskan Hubungan Akun",
				description: `Apakah Anda yakin ingin memutuskan hubungan akun dengan ${company.name}? Anda akan kehilangan akses ke layanan premium terintegrasi.`,
				confirmText: "Ya, Putuskan",
				cancelText: "Batal",
				onConfirm: async () => {
					await detachAccount(externalAccount._id);
					setLocalUnsubscribed(true);
					void fetchCompanyServices();
					void fetchCompanyDetail();
				},
			});
		}
	};

	const serviceTypeLabel = (type: any) => {
		switch (type) {
			case "internal":
				return "Internal";
			case "public":
				return "Publik";
			case "member_only":
				return "Berlangganan";
			default:
				return type;
		}
	};

	if (error) return <EmptyData />;

	return (
		<>
			{isPairing && (
				<FullPageLoading message="Menghubungkan akun... Silakan selesaikan proses otorisasi pada tab baru." />
			)}
			<div className="space-y-6">
				{/* Page Header */}
				<PageHeader
					title="Layanan Perusahaan"
					subtitle="Pilih layanan yang Anda butuhkan dari perusahaan ini."
					backPath={true}
				/>

				{loading ?
					<div className="py-12">
						<SectionLoading message="Memuat informasi perusahaan dan layanan..." />
					</div>
				:	<>
						{/* Hero Section - Company Info */}
						{company && (
							<motion.div
								initial={{ opacity: 0, y: -12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.35, ease: "easeOut" }}
								className={`grid grid-cols-1 ${isIntegrationActive ? "lg:grid-cols-3" : ""} gap-4`}>
								{/* Left panel — Company Profile */}
								<div
									className={`${isIntegrationActive ? "lg:col-span-2" : "col-span-full"} relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 flex flex-col justify-between gap-6`}>
									{/* Decorative circle */}
									<div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/5 pointer-events-none" />
									<div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-blue-50 pointer-events-none" />

									<div className="relative flex items-start gap-4">
										<div className="shrink-0 p-3.5 bg-primary/5 text-primary rounded-xl">
											<Building2 className="w-7 h-7" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex flex-wrap items-center gap-2 mb-1">
												<h2 className="text-lg font-bold text-slate-900 truncate">
													{company.name}
												</h2>
											</div>
											{company.address && (
												<div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
													<MapPin className="w-3.5 h-3.5 shrink-0" />
													<span className="truncate">{company.address}</span>
												</div>
											)}
											{company.description && (
												<p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
													{company.description}
												</p>
											)}
										</div>
									</div>

									{/* Stats row */}
									<div className="relative flex items-center gap-6 pt-4 border-t border-slate-100">
										<div>
											<p className="text-2xl font-bold text-primary">
												{filteredServices.length}
											</p>
											<p className="text-xs text-slate-500 mt-0.5">
												Layanan Tersedia
											</p>
										</div>
										{isIntegrationActive && (
											<>
												<div className="w-px h-10 bg-slate-100" />
												<div>
													<p className="text-2xl font-bold text-slate-800">
														{isPaired ? "Terhubung" : "Belum"}
													</p>
													<p className="text-xs text-slate-500 mt-0.5">
														Status Integrasi
													</p>
												</div>
											</>
										)}
									</div>
								</div>

								{/* Right panel — Paired Account Card */}
								{isIntegrationActive && (
									<AnimatePresence mode="wait">
										<motion.div
											key={isPaired ? "paired" : "unpaired"}
											initial={{ opacity: 0, scale: 0.97 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.97 }}
											transition={{ duration: 0.25, ease: "easeOut" }}
											className={`rounded-2xl p-[1.5px] ${
												isPaired ?
													isSubscribed ?
														"bg-gradient-to-br from-[#C9A84C] via-[#F5E27A] to-[#A97C2F]"
													:	"bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-600 shadow-md"
												:	"bg-slate-200"
											}`}>
											<div
												className={`rounded-[calc(1rem-1.5px)] p-5 flex flex-col gap-4 h-full ${
													isPaired ?
														isSubscribed ? "bg-[#FEFBF0]"
														:	"bg-[#F0F7FF]"
													:	"bg-white"
												}`}>
												{/* Header */}
												<div className="flex items-start justify-between gap-3">
													<div className="flex items-center gap-2.5">
														<div
															className={`p-2 rounded-xl ${
																isPaired ?
																	isSubscribed ?
																		"bg-gradient-to-br from-[#C9A84C] to-[#A97C2F] text-white shadow-sm"
																	:	"bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
																:	"bg-slate-100 text-slate-400"
															}`}>
															{isPaired ?
																<CheckCircle2 className="w-5 h-5" />
															:	<XCircle className="w-5 h-5" />}
														</div>
														<div>
															<p
																className={`text-sm font-semibold leading-tight ${
																	isPaired ?
																		isSubscribed ? "text-[#7A5C1E]"
																		:	"text-blue-900"
																	:	"text-slate-800"
																}`}>
																{isPaired ?
																	"Akun Terhubung"
																:	"Belum Terhubung"}
															</p>
															<p
																className={`text-xs mt-0.5 ${
																	isPaired ?
																		isSubscribed ? "text-[#B8963E]/70"
																		:	"text-blue-600/85"
																	:	"text-slate-400"
																}`}>
																{isPaired ?
																	isSubscribed ?
																		"Langganan Premium Aktif"
																	:	"Koneksi Standar Aktif"
																:	"Integrasi Sistem"}
															</p>
														</div>
													</div>
													{/* Status pill */}
													<span
														className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
															isPaired ?
																isSubscribed ?
																	"bg-gradient-to-r from-[#C9A84C] to-[#F5E27A] text-[#5C3D0E] shadow-sm"
																:	"bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-sm"
															:	"bg-slate-100 text-slate-500"
														}`}>
														<span
															className={`w-1.5 h-1.5 rounded-full ${
																isPaired ?
																	isSubscribed ? "bg-[#7A5C1E]"
																	:	"bg-white"
																:	"bg-slate-400"
															}`}
														/>
														{isPaired ?
															isSubscribed ?
																"Premium"
															:	"Terhubung"
														:	"Tidak Aktif"}
													</span>
												</div>

												{/* Divider */}
												{isPaired && (
													<div
														className={`h-px ${
															isSubscribed ?
																"bg-gradient-to-r from-[#C9A84C]/40 via-[#F5E27A]/60 to-[#C9A84C]/40"
															:	"bg-gradient-to-r from-blue-500/20 via-sky-400/40 to-indigo-600/20"
														}`}
													/>
												)}

												{/* Body */}
												{isPaired && externalAccount ?
													<div
														className={`border rounded-xl px-4 py-3 space-y-0.5 ${
															isSubscribed ?
																"bg-white/70 border-[#E8D48B]/60"
															:	"bg-white/70 border-blue-200"
														}`}>
														<p
															className={`text-xs font-semibold uppercase tracking-widest ${
																isSubscribed ? "text-[#B8963E]/80" : (
																	"text-blue-600/80"
																)
															}`}>
															✦ Terhubung sebagai
														</p>
														<p
															className={`text-sm font-bold ${
																isSubscribed ? "text-[#7A5C1E]" : (
																	"text-blue-900"
																)
															}`}>
															{externalAccount.external_customer_name}
														</p>
														<p
															className={`text-xs ${
																isSubscribed ? "text-[#A97C2F]/70" : (
																	"text-blue-500"
																)
															}`}>
															{externalAccount.external_customer_email}
														</p>
													</div>
												:	<p
														className={`text-sm leading-relaxed ${
															isPaired ?
																isSubscribed ? "text-[#7A5C1E]/80"
																:	"text-blue-900/80"
															:	"text-slate-500"
														}`}>
														{isPaired ?
															isSubscribed ?
																"Anda memiliki akses penuh ke layanan eksklusif berkat integrasi akun premium."
															:	"Akun Anda terhubung dengan sistem eksternal secara sukses."

														:	`Hubungkan akun Anda ke sistem ${company?.name ?? "perusahaan"} untuk akses layanan lebih lengkap.`
														}
													</p>
												}

												{/* Actions */}
												<div className="flex flex-col gap-2">
													{isPaired ?
														<>
															<Button
																size="sm"
																disabled
																className={`w-full cursor-not-allowed opacity-100 border-0 font-semibold shadow-md ${
																	isSubscribed ?
																		"bg-gradient-to-r from-[#C9A84C] via-[#F0D060] to-[#A97C2F] text-[#3D2200] hover:opacity-90"
																	:	"bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
																}`}>
																<CheckCircle2 className="w-4 h-4 mr-2" />
																Sudah Terhubung
															</Button>
															<Button
																size="sm"
																variant="ghost"
																disabled={isDetaching}
																onClick={handleDetach}
																className={`w-full border hover:cursor-pointer ${
																	isSubscribed ?
																		"text-[#A97C2F]/70 hover:text-red-600 hover:bg-red-50 border-[#E8D48B]/50 hover:border-red-100"
																	:	"text-blue-600 hover:text-red-600 hover:bg-red-50 border-blue-200 hover:border-red-100"
																}`}>
																{isDetaching ?
																	"Memproses..."
																:	"Putuskan Hubungan"}
															</Button>
														</>
													:	<Button
															size="sm"
															disabled={isPairing}
															onClick={handlePairing}
															className="w-full hover: cursor-pointer">
															{isPairing ?
																"Menghubungkan..."
															:	"Hubungkan Akun"}
														</Button>
													}
													<p
														className={`text-center text-xs ${
															isPaired ?
																isSubscribed ? "text-[#B8963E]/60"
																:	"text-blue-500/60"
															:	"text-slate-400"
														}`}>
														Hubungi perusahaan untuk informasi lebih lanjut
													</p>
												</div>
											</div>
										</motion.div>
									</AnimatePresence>
								)}
							</motion.div>
						)}

						{/* Filter */}
						<div>
							<GenericFilter config={filterConfigServices} />
						</div>

						{/* Services Grid */}
						<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
							<AnimatePresence mode="wait">
								{loading ?
									<motion.div
										key="loading-services"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="col-span-full">
										<SectionLoading message="Memuat layanan..." />
									</motion.div>
								: filteredServices.length > 0 ?
									filteredServices.map((service) => (
										<motion.div
											key={`service-${service._id}`}
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -16 }}
											transition={{ duration: 0.2, ease: "easeOut" }}>
											<div
												onClick={() =>
													navigate(
														`/dashboard/client/company/services/${service._id}/intake-forms`,
													)
												}
												className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer">
												<div className="px-6 py-5">
													<div className="flex items-start gap-4">
														{/* Icon */}
														<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
															<ClipboardList className="w-6 h-6" />
														</div>

														{/* Text Content */}
														<div className="flex-1 space-y-1">
															<h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-1">
																{service.title || "Untitled Service"}
															</h3>
															<p className="text-sm text-slate-500 leading-relaxed line-clamp-1">
																{service.description ||
																	"Tidak ada deskripsi tersedia."}
															</p>
														</div>
													</div>

													{/* Description full (clamped) */}
													<div className="text-sm pt-2 text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem]">
														{service.description ||
															"Tidak ada deskripsi tersedia untuk layanan ini."}
													</div>
												</div>

												<div className="grid grid-cols-1 text-xs mx-6 border-t border-slate-200/70 py-3">
													<div className="flex items-center justify-between text-xs text-slate-400">
														<div className="flex items-center gap-2">
															{service.accessType &&
																(service.accessType === "member_only" ?
																	<div className="inline-flex rounded-full p-[1px] bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
																		<div className="inline-flex items-center justify-center rounded-full bg-background px-2.5 py-0.5">
																			{/* // 3. Teks dengan efek Gradient Text */}
																			<span className="text-xs font-semibold capitalize bg-gradient-to-br from-[#FCF6BA] via-[#BF953F] to-[#FCF6BA] bg-clip-text text-transparent">
																				{serviceTypeLabel(service.accessType)}
																			</span>
																		</div>
																	</div>
																:	/* --- BADGE STANDAR: INTERNAL / PUBLIK --- */
																	<Badge
																		variant="outline"
																		className="text-xs capitalize text-slate-500 font-normal">
																		{serviceTypeLabel(service.accessType)}
																	</Badge>)}
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))
								:	<motion.div
										key="empty-services"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="col-span-full">
										<EmptyData />
									</motion.div>
								}
							</AnimatePresence>
						</div>
					</>
				}
			</div>

			{/* Faq Chatbot */}
			{company?.isFaqActive === true && (
				<FaqChatbot
					title={company?.name || ""}
					companyId={company?._id || ""}
				/>
			)}
		</>
	);
};

export default ClientCompanyServices;
