import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowRight,
	Building2,
	MapPin,
	CheckCircle2,
	XCircle,
	ClipboardList,
} from "lucide-react";
import useClientCompany from "../hooks/client-company-services";
import { GenericFilter } from "@/shared/molecules/generic-filter";
import { EmptyData } from "@/shared/molecules/empty-data";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import ClaimMembershipDialog from "@/features/client/memberships/components/claim-membership-dialog";

const ClientCompanyServices = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [claimDialogOpen, setClaimDialogOpen] = useState(false);
	const {
		fetchCompanyServices,
		filteredServices,
		filterConfigServices,
		companies,
		isSubscribed,
		loading,
		error,
	} = useClientCompany();

	// Cari data company yang sesuai dengan id dari URL
	const company = companies.find((c) => c._id === id);

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

	if (error)
		return (
			<div className="flex flex-col items-center justify-center py-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
					<p className="text-red-600 text-center">{error}</p>
					<Button
						variant="outline"
						className="mt-4 w-full"
						onClick={() => navigate(-1)}>
						Kembali
					</Button>
				</div>
			</div>
		);

	return (
		<>
		<div className="space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Layanan Perusahaan"
				subtitle="Pilih layanan yang Anda butuhkan dari perusahaan ini."
				backPath={true}
			/>

			{/* Hero Section - Company Info */}
			{company && (
				<motion.div
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* Left panel — Company Profile */}
					<div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 flex flex-col justify-between gap-6">
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
							<div className="w-px h-10 bg-slate-100" />
							<div>
								<p className="text-2xl font-bold text-slate-800">
									{isSubscribed ? "Aktif" : "—"}
								</p>
								<p className="text-xs text-slate-500 mt-0.5">
									Status Langganan
								</p>
							</div>
						</div>
					</div>

					{/* Right panel — Subscription CTA */}
					<div
						className={`relative overflow-hidden rounded-2xl shadow-sm p-6 flex flex-col justify-between gap-4 transition-all ${
							isSubscribed ?
								"bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] via-[55%] to-[#B38728]"
							:	"bg-gradient-to-br from-primary to-blue-700"
						}`}>
						{/* Decorative: Ubah warna lingkaran samar agar sesuai dengan background */}
						<div
							className={`absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none ${isSubscribed ? "bg-black/5" : "bg-white/10"}`}
						/>
						<div
							className={`absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none ${isSubscribed ? "bg-black/5" : "bg-white/5"}`}
						/>

						<div className="relative">
							<div className="flex gap-2 items-center">
								{/* Ikon */}
								{isSubscribed ?
									<CheckCircle2 className="w-8 h-8 text-white/80 drop-shadow-xl" />
								:	<XCircle className="w-8 h-8 text-white/80" />}

								{/* Judul Teks */}
								<p
									className={`font-semibold text-base leading-snug mb-1 ${isSubscribed ? "text-white/80" : "text-white"}`}>
									{isSubscribed ?
										"Anda sudah berlangganan"
									:	"Belum berlangganan?"}
								</p>
							</div>

							{/* Paragraf Teks */}
							<p
								className={`text-sm leading-relaxed mt-5 ${isSubscribed ? "text-yellow-950/80" : "text-white/75"}`}>
								{isSubscribed ?
									"Anda memiliki akses penuh ke semua layanan eksklusif yang tersedia. Silahkan pilih layanan yang Anda butuhkan."
								:	"Berlangganan untuk mendapatkan akses ke seluruh layanan eksklusif perusahaan."
								}
							</p>
						</div>

						<div className="relative flex flex-col gap-2">
							{isSubscribed ?
								/* Button Mode VIP (Gold Background) */
								<Button
									size="sm"
									disabled
									className="w-full bg-yellow-950/10 hover:bg-yellow-950/10 text-yellow-950 border border-yellow-950/20 cursor-not-allowed opacity-100 shadow-none">
									<CheckCircle2 className="w-4 h-4 mr-2" />
									Sudah Berlangganan
								</Button>
							:	/* Button Mode Biasa (Blue Background) */
								<Button
									size="sm"
									onClick={() => setClaimDialogOpen(true)}
									className="w-full bg-white text-primary font-semibold hover:bg-white/90 shadow-md">
									Mulai Berlangganan
								</Button>
							}

							{!isSubscribed && (
								<p className="text-white/60 text-xs text-center mt-1">
									Hubungi perusahaan untuk informasi lebih lanjut
								</p>
							)}
						</div>
					</div>
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
								<Card className="group gap-2 flex flex-col h-full bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
									<CardHeader className="px-6">
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
										<div className="text-sm pt-2 text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
											{service.description ||
												"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
											Lorem ipsum dolor sit amet consectetur adipisicing elit.
											Magni corporis beatae minima labore similique totam
											facilis officiis omnis officia incidunt voluptatum
											dolorem, voluptatibus nulla ratione alias eius nemo,
											eligendi fuga! Dolorum omnis, consequuntur neque inventore
											nemo ullam, sunt architecto quae iste hic illum itaque
											libero dolor? Dolorum deserunt, modi quaerat magnam magni
											inventore? Rerum accusamus sint maxime placeat sapiente
											quidem. Repudiandae, vel error, reprehenderit consequuntur
											neque repellendus, iure temporibus nisi iusto laboriosam
											debitis blanditiis. Accusantium temporibus ipsam est.
											Architecto obcaecati culpa reprehenderit. Modi praesentium
											incidunt cum temporibus animi molestias rerum. Corrupti,
											minus saepe culpa nam alias repudiandae sunt aliquam
											explicabo error nihil mollitia veniam cum voluptate qui,
											recusandae, fugiat facilis animi harum dicta maiores
											deserunt veritatis dolore at. Harum, laudantium.
											Laboriosam veritatis quis voluptas, dignissimos ut
											provident dicta molestias quasi totam incidunt odit in
											doloribus repudiandae amet enim, sequi repellat quos eos
											hic molestiae earum aliquid iure excepturi? Pariatur,
											odio.
										</div>
									</CardHeader>

									<CardFooter className="grid grid-cols-1 text-xs mx-6 border-t border-slate-200/70 p-0 py-3">
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

											{/* Action */}
											<Button
												variant="outline"
												size="sm"
												className="text-xs rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
												onClick={() =>
													navigate(
														`/dashboard/client/company/services/${service._id}/intake-forms`,
													)
												}>
												Lihat Detail
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									</CardFooter>
								</Card>
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
		</div>

		{/* Claim Membership Dialog */}
		<ClaimMembershipDialog
			open={claimDialogOpen}
			onOpenChange={setClaimDialogOpen}
			onSuccess={fetchCompanyServices}
		/>
		</>
	);
};

export default ClientCompanyServices;
