import { useEffect } from "react";
import {
	Users2,
	ClipboardCheck,
	FileText,
	Globe,
	Lock,
	Settings2,
	CheckCircle2,
	XCircle,
	ScrollText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useTemplatePreview } from "../hooks/use-template-preview";
import { SectionLoading } from "@/shared/atoms";
import { motion } from "framer-motion";

// ─── Helpers ────────────────────────────────────────────────────────────────

const accessTypeLabel: Record<
	string,
	{ label: string; icon: React.ReactNode }
> = {
	public: { label: "Publik", icon: <Globe className="size-3.5" /> },
	member_only: { label: "Berlangganan", icon: <Lock className="size-3.5" /> },
	internal: { label: "Internal", icon: <Lock className="size-3.5" /> },
};

const approvalLabel: Record<string, string> = {
	auto: "Otomatis",
	manager: "Persetujuan Manager",
	staff_pic: "Persetujuan Staff PIC",
};

const formTypeLabel = (type: string) => {
	switch (type?.toLowerCase()) {
		case "report":
			return "Formulir Laporan";
		case "intake":
			return "Formulir Permintaan";
		case "work_order":
			return "Formulir Perintah Kerja";
		case "review":
			return "Formulir Ulasan";
		default:
			return type;
	}
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const SectionHeader = ({
	icon,
	title,
	subtitle,
}: {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
}) => (
	<div className="flex items-center gap-3 mb-4">
		<div className="flex items-center justify-center size-9 sm:size-10 rounded-xl bg-primary/5 text-primary shrink-0  border border-primary/5">
			{icon}
		</div>
		<div className="space-y-0.5">
			<h3 className="font-bold text-slate-800 text-sm tracking-tight">
				{title}
			</h3>
			<p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
		</div>
	</div>
);

const FormCard = ({
	title,
	description,
	formType,
}: {
	title: string;
	description: string;
	formType?: string;
}) => (
	<motion.div
		whileHover={{ y: -2 }}
		className="rounded-2xl border border-blue-100 bg-white p-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-md group">
		{formType && (
			<p className="text-[10px] font-bold uppercase text-primary tracking-widest">
				{formTypeLabel(formType)}
			</p>
		)}
		<div className="flex items-center gap-3.5">
			<div className="shrink-0 p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
				<ScrollText className="w-4 h-4" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-bold text-sm text-slate-800 truncate">{title}</p>
				{description && (
					<p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed font-medium">
						{description}
					</p>
				)}
			</div>
		</div>
	</motion.div>
);

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface TemplatePreviewDialogProps {
	open: boolean;
	templateId: string | null;
	onClose: () => void;
}

export const TemplatePreviewDialog = ({
	open,
	templateId,
	onClose,
}: TemplatePreviewDialogProps) => {
	const { preview, loading, error, fetchPreview } = useTemplatePreview();

	useEffect(() => {
		if (open && templateId) {
			void fetchPreview(templateId);
		}
	}, [open, templateId]);

	const service = preview?.service;
	const accessInfo =
		service ?
			(accessTypeLabel[service.accessType] ?? {
				label: service.accessType,
				icon: <Globe className="size-3.5" />,
			})
		:	null;

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[92vh] rounded-[2rem] sm:rounded-3xl border-none p-0 overflow-hidden shadow-2xl flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-b from-primary to-primary/70 text-white p-5 sm:p-6 relative shrink-0">
					<DialogHeader className="relative z-10 text-left">
						<DialogTitle className="flex items-center gap-3 sm:gap-4 text-white text-lg sm:text-xl">
							<div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/20">
								<FileText className="w-5 h-5 sm:w-6" />
							</div>
							<div className="space-y-0.5 sm:space-y-1">
								<span className="font-bold tracking-tight">
									Preview Template
								</span>
								<p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-80">
									Layanan & Konfigurasi
								</p>
							</div>
						</DialogTitle>
						<DialogDescription className="text-white/90 mt-3 sm:mt-4 text-xs sm:text-sm font-medium opacity-90 leading-relaxed max-w-2xl">
							Pahami struktur layanan, formulir, dan alur kerja yang sudah
							dikonfigurasi dalam template ini sebelum digunakan.
						</DialogDescription>
					</DialogHeader>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
					{loading ?
						<div className="py-16 sm:py-20 flex flex-col items-center justify-center">
							<SectionLoading message="Menyelaraskan detail template..." />
						</div>
					: error || !service ?
						<div className="py-16 sm:py-20 text-center space-y-3">
							<div className="inline-flex p-3 sm:p-4 rounded-full bg-red-50 text-red-500 mb-2">
								<XCircle className="w-6 h-6 sm:w-8 " />
							</div>
							<p className="text-slate-600 font-semibold italic text-sm sm:text-base">
								{error || "Detail template tidak ditemukan."}
							</p>
						</div>
					:	<div className="space-y-8 sm:space-y-10">
							{/* ── Overview Card ── */}
							<section className="bg-white rounded-[1.5rem] sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-5 sm:space-y-6">
								<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
									<div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0 text-left">
										<p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary">
											Informasi Dasar
										</p>
										<h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-snug break-words">
											{service.title}
										</h2>
									</div>
									{accessInfo && (
										<Badge
											variant="secondary"
											className="w-fit shrink-0 flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-700 border-blue-100">
											{accessInfo.icon}
											{accessInfo.label}
										</Badge>
									)}
								</div>

								{service.description && (
									<p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
										{service.description}
									</p>
								)}

								<Separator className="bg-slate-100" />

								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-center gap-2">
										<Settings2 className="size-3.5 sm:size-4 text-primary" />
										<p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-800">
											Konfigurasi Persetujuan
										</p>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
										<div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 space-y-1 sm:space-y-1.5">
											<p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-500">
												Tipe Persetujuan
											</p>
											<p className="text-xs sm:text-sm font-bold text-slate-800 capitalize">
												{approvalLabel[
													service.serviceRequestConfig
														.serviceRequestApprovalAccessType
												] ??
													service.serviceRequestConfig
														.serviceRequestApprovalAccessType}
											</p>
										</div>
										<div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 space-y-1 sm:space-y-1.5">
											<p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-500">
												Review Diperlukan
											</p>
											<div className="flex items-center gap-2">
												{service.serviceRequestConfig.reviewNeed ?
													<>
														<CheckCircle2 className="size-3.5 sm:size-4 text-emerald-500 shrink-0" />
														<p className="text-xs sm:text-sm font-bold text-slate-800">
															Ya, diperlukan
														</p>
													</>
												:	<>
														<XCircle className="size-3.5 sm:size-4 text-slate-400 shrink-0" />
														<p className="text-xs sm:text-sm font-bold text-slate-500">
															Tidak diperlukan
														</p>
													</>
												}
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* ── Formulir ── */}
							<section className="space-y-4">
								<SectionHeader
									icon={<ClipboardCheck className="size-3.5 sm:size-4" />}
									title="Arsitektur Formulir"
									subtitle="Formulir yang akan digunakan oleh klien."
								/>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
									{service.serviceRequestConfig.intakeForm ?
										<FormCard
											title={service.serviceRequestConfig.intakeForm.title}
											description={
												service.serviceRequestConfig.intakeForm.description
											}
											formType={
												service.serviceRequestConfig.intakeForm.formType
											}
										/>
									:	<div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center text-[11px] sm:text-xs text-slate-400 italic bg-white/50 min-h-[80px] sm:min-h-[100px]">
											Formulir permintaan tidak dikonfigurasi
										</div>
									}
									{service.serviceRequestConfig.reviewForm ?
										<FormCard
											title={service.serviceRequestConfig.reviewForm.title}
											description={
												service.serviceRequestConfig.reviewForm.description
											}
											formType={
												service.serviceRequestConfig.reviewForm.formType
											}
										/>
									:	<div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center text-[11px] sm:text-xs text-slate-400 italic bg-white/50 min-h-[80px] sm:min-h-[100px]">
											Formulir ulasan tidak dikonfigurasi
										</div>
									}
								</div>
							</section>

							{/* ── Work Order ── */}
							{service.workOrdersConfig &&
								service.workOrdersConfig.length > 0 && (
									<section className="space-y-4">
										<SectionHeader
											icon={<Settings2 className="size-3.5 sm:size-4" />}
											title="Struktur Perintah Kerja"
											subtitle="Alur kerja internal operasional."
										/>
										<div className="space-y-4 sm:space-y-5">
											{service.workOrdersConfig.map((woc) => (
												<div
													key={woc._id}
													className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-4 sm:p-6 space-y-5 sm:space-y-6 text-left">
													<div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/50 border border-blue-100">
														<div className="size-10 sm:size-11 rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
															<Users2 className="size-4 sm:size-5" />
														</div>
														<div className="space-y-0.5">
															<p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-blue-600/70">
																Penanggung Jawab
															</p>
															<p className="font-extrabold text-sm sm:text-base text-slate-800">
																{woc.positionsOnDuty?.name ?? "Tanpa Posisi"}
															</p>
														</div>
													</div>

													<div className="grid grid-cols-2 gap-3 sm:gap-4">
														<div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/30 p-3 sm:p-4 space-y-1 sm:space-y-1.5">
															<p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-500">
																Persetujuan Tugas
															</p>
															<p className="text-[11px] sm:text-xs font-extrabold text-slate-800">
																{approvalLabel[
																	woc.workOrderApprovalAccessType
																] ?? woc.workOrderApprovalAccessType}
															</p>
														</div>
														<div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/30 p-3 sm:p-4 space-y-1 sm:space-y-1.5">
															<p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-500">
																Persetujuan Laporan
															</p>
															<p className="text-[11px] sm:text-xs font-extrabold text-slate-800">
																{approvalLabel[
																	woc.workReportApprovalAccessType
																] ?? woc.workReportApprovalAccessType}
															</p>
														</div>
													</div>

													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<div className="space-y-2 sm:space-y-3">
															<p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 flex items-center gap-2">
																<div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300" />
																Formulir Instruksi
															</p>
															{woc.workOrderForm ?
																<FormCard
																	title={woc.workOrderForm.title}
																	description={woc.workOrderForm.description}
																/>
															:	<div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 p-3 sm:p-4 flex items-center justify-center text-[10px] sm:text-[11px] text-slate-400 italic bg-white/50 min-h-[60px]">
																	N/A
																</div>
															}
														</div>
														<div className="space-y-2 sm:space-y-3">
															<p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 flex items-center gap-2">
																<div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300" />
																Formulir Laporan
															</p>
															{woc.workReportForm ?
																<FormCard
																	title={woc.workReportForm.title}
																	description={woc.workReportForm.description}
																/>
															:	<div className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 p-3 sm:p-4 flex items-center justify-center text-[10px] sm:text-[11px] text-slate-400 italic bg-white/50 min-h-[60px]">
																	N/A
																</div>
															}
														</div>
													</div>
												</div>
											))}
										</div>
									</section>
								)}
						</div>
					}
				</div>
			</DialogContent>
		</Dialog>
	);
};
