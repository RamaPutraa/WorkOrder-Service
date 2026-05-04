import PageHeader from "@/shared/atoms/header-content";
import { useServices } from "../hooks/useServices";
import { SectionLoading } from "@/shared/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyData } from "@/shared/molecules/empty-data";
import { Badge } from "@/components/ui/badge";

const ListServices = () => {
	const { services, loading } = useServices();
	const navigate = useNavigate();

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

	return (
		<>
			<PageHeader
				title="Daftar Layanan"
				subtitle="Berikut merupakan daftar layanan yang tersedia di perusahaan."
				backPath={true}
			/>

			{loading ?
				<SectionLoading message="Memuat data layanan..." />
			:	<div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
						: services.length > 0 ?
							services.map((service) => (
								<motion.div
									key={`service-${service._id}`}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -16 }}
									transition={{ duration: 0.2, ease: "easeOut" }}>
									<div
										onClick={() =>
											navigate(
												`/dashboard/staff/services/${service._id}/form-intake`,
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
											<div className="text-sm pt-2 text-slate-500 leading-relaxed line-clamp-3 min-h-[3.75rem] text-justify">
												{service.description ||
													"Tidak ada deskripsi tersedia untuk layanan ini."}{" "}
												Lorem ipsum dolor sit amet consectetur adipisicing elit.
												Magni corporis beatae minima labore similique totam
												facilis officiis omnis officia incidunt voluptatum
												dolorem, voluptatibus nulla ratione alias eius nemo,
												eligendi fuga! Dolorum omnis, consequuntur neque
												inventore nemo ullam, sunt architecto quae iste hic
												illum itaque libero dolor? Dolorum deserunt, modi
												quaerat magnam magni inventore? Rerum accusamus sint
												maxime placeat sapiente quidem. Repudiandae, vel error,
												reprehenderit consequuntur neque repellendus, iure
												temporibus nisi iusto laboriosam debitis blanditiis.
												Accusantium temporibus ipsam est. Architecto obcaecati
												culpa reprehenderit. Modi praesentium incidunt cum
												temporibus animi molestias rerum. Corrupti, minus saepe
												culpa nam alias repudiandae sunt aliquam explicabo error
												nihil mollitia veniam cum voluptate qui, recusandae,
												fugiat facilis animi harum dicta maiores deserunt
												veritatis dolore at. Harum, laudantium. Laboriosam
												veritatis quis voluptas, dignissimos ut provident dicta
												molestias quasi totam incidunt odit in doloribus
												repudiandae amet enim, sequi repellat quos eos hic
												molestiae earum aliquid iure excepturi? Pariatur, odio.
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
			}
		</>
	);
};

export default ListServices;
