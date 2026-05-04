import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Sparkles,
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
import { mockTemplatePreview } from "../mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/shared/atoms/header-content";

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
	<div className="flex items-center gap-2 mb-4">
		<div className="flex items-center justify-center size-10 rounded-lg bg-primary/5 text-primary shrink-0 shadow-sm">
			{icon}
		</div>
		<div className="space-y-1">
			<h3 className="font-semibold text-muted-foreground text-sm tracking-wide uppercase">
				{title}
			</h3>
			<p className="text-sm text-muted-foreground">{subtitle}</p>
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
	<div className="group rounded-xl border bg-card p-4 flex flex-col gap-3 h-fit">
		{formType && (
			<p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
				{formTypeLabel(formType)}
			</p>
		)}
		<div className="flex items-center gap-3">
			<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
				<ScrollText className="w-5 h-5" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-sm truncate">{title}</p>
				{description && (
					<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
						{description}
					</p>
				)}
			</div>
		</div>
	</div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const ServicesTypePreview = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const templateId = searchParams.get("templateId") ?? "";
	const preview = mockTemplatePreview[templateId];

	if (!preview) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-slate-400 text-sm mb-3">
						Template tidak ditemukan.
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate(-1)}
						className="cursor-pointer">
						Kembali
					</Button>
				</div>
			</div>
		);
	}

	const { service } = preview;
	const accessInfo = accessTypeLabel[service.accessType] ?? {
		label: service.accessType,
		icon: <Globe className="size-3.5" />,
	};

	return (
		<>
			<PageHeader
				title="Preview Template"
				subtitle="Preview detail layanan beserta formulir dan konfigurasi pekerjaannya."
				backPath={true}
			/>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2, ease: "easeOut" }}
				className="space-y-8 pb-10">
				{/* ── Overview Card ── */}
				<section className="rounded-2xl border bg-card overflow-hidden shadow-xs">
					<div className="p-6 space-y-5">
						{/* Title row */}
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-1 flex-1 min-w-0">
								<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
									Nama Template
								</p>
								<h2 className="text-lg font-bold tracking-tight text-foreground leading-snug">
									{service.title}
								</h2>
							</div>
							<Badge
								variant="outline"
								className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]">
								{accessInfo.icon}
								{accessInfo.label}
							</Badge>
						</div>

						{/* Description */}
						{service.description && (
							<p className="text-sm text-muted-foreground leading-relaxed">
								{service.description}
							</p>
						)}

						<Separator className="opacity-50" />

						{/* Approval config */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Settings2 className="size-3.5 text-muted-foreground" />
								<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
									Konfigurasi Persetujuan Permintaan
								</p>
							</div>
							<div className="grid sm:grid-cols-2 gap-3">
								<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1">
									<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
										Tipe Persetujuan
									</p>
									<p className="text-sm font-medium capitalize">
										{approvalLabel[
											service.serviceRequestConfig
												.serviceRequestApprovalAccessType
										] ??
											service.serviceRequestConfig
												.serviceRequestApprovalAccessType}
									</p>
								</div>
								<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1">
									<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
										Review Diperlukan
									</p>
									<div className="flex items-center gap-1.5">
										{service.serviceRequestConfig.reviewNeed ?
											<>
												<CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
												<p className="text-sm font-medium">Ya, diperlukan</p>
											</>
										:	<>
												<XCircle className="size-4 text-muted-foreground shrink-0" />
												<p className="text-sm font-medium text-muted-foreground">
													Tidak diperlukan
												</p>
											</>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ── Formulir Permintaan Layanan ── */}
				<section className="space-y-5">
					<SectionHeader
						icon={<ClipboardCheck className="size-4" />}
						title="Formulir Permintaan Layanan"
						subtitle="Formulir yang diisi pengguna saat mengajukan dan meninjau permintaan layanan."
					/>
					<div className="grid lg:grid-cols-2 gap-4">
						{service.serviceRequestConfig.intakeForm ?
							<FormCard
								title={service.serviceRequestConfig.intakeForm.title}
								description={
									service.serviceRequestConfig.intakeForm.description
								}
								formType={service.serviceRequestConfig.intakeForm.formType}
							/>
						:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 min-h-[100px]">
								Formulir permintaan tidak tersedia.
							</div>
						}
						{service.serviceRequestConfig.reviewForm ?
							<FormCard
								title={service.serviceRequestConfig.reviewForm.title}
								description={
									service.serviceRequestConfig.reviewForm.description
								}
								formType={service.serviceRequestConfig.reviewForm.formType}
							/>
						:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 min-h-[100px]">
								Formulir ulasan tidak tersedia.
							</div>
						}
					</div>
				</section>

				{/* ── Konfigurasi Perintah Kerja ── */}
				{service.workOrdersConfig && service.workOrdersConfig.length > 0 && (
					<section className="space-y-4">
						<SectionHeader
							icon={<Settings2 className="size-4" />}
							title="Detail Konfigurasi Perintah Kerja"
							subtitle="Konfigurasi perintah kerja yang akan dikerjakan oleh pegawai."
						/>
						<div className="space-y-5">
							{service.workOrdersConfig.map((woc, i) => (
								<div
									key={woc._id}
									className="rounded-2xl border bg-card p-5 lg:p-6 shadow-sm">
									<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
										{/* Col 1: Posisi & Approval */}
										<div className="flex flex-col space-y-6 xl:border-r xl:pr-8 border-border/50">
											{/* Posisi */}
											<div className="space-y-4">
												<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
													<Users2 className="size-3.5 text-primary" />
													Informasi Penugasan
												</p>
												<div className="flex flex-col gap-3">
													<div className="flex items-center gap-4 p-4 rounded-2xl border bg-muted/20 hover:bg-muted/30 transition-all duration-200">
														<div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
															<Users2 className="size-5" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
																Posisi Penanggung Jawab
															</p>
															<p className="font-bold text-base truncate text-foreground">
																{woc.positionsOnDuty?.name ?? "—"}
															</p>
														</div>
													</div>
												</div>
											</div>
											{/* Approval */}
											<div className="space-y-4 mt-auto">
												<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
													<CheckCircle2 className="size-3.5 text-primary" />
													Hak Akses Persetujuan
												</p>
												<div className="grid grid-cols-2 gap-3">
													<div className="rounded-2xl border bg-muted/20 p-4 flex flex-col justify-center gap-1.5 hover:bg-muted/30 transition-all">
														<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
															Tugas Kerja
														</p>
														<p className="text-xs font-bold text-foreground">
															{approvalLabel[woc.workOrderApprovalAccessType] ??
																woc.workOrderApprovalAccessType}
														</p>
													</div>
													<div className="rounded-2xl border bg-muted/20 p-4 flex flex-col justify-center gap-1.5 hover:bg-muted/30 transition-all">
														<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
															Pelaporan
														</p>
														<p className="text-xs font-bold text-foreground">
															{approvalLabel[
																woc.workReportApprovalAccessType
															] ?? woc.workReportApprovalAccessType}
														</p>
													</div>
												</div>
											</div>
										</div>

										{/* Col 2: Form Perintah Kerja */}
										<div className="flex flex-col space-y-3">
											<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ">
												<FileText className="size-3.5" /> Formulir Perintah
												Kerja
											</p>
											<div className="flex-1">
												{woc.workOrderForm ?
													<FormCard
														title={woc.workOrderForm.title}
														description={woc.workOrderForm.description}
													/>
												:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 h-full min-h-[120px]">
														Tidak tersedia
													</div>
												}
											</div>
										</div>

										{/* Col 3: Form Laporan Kerja */}
										<div className="flex flex-col space-y-3">
											<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
												<ClipboardCheck className="size-3.5" /> Formulir Laporan
												Kerja
											</p>
											<div className="flex-1">
												{woc.workReportForm ?
													<FormCard
														title={woc.workReportForm.title}
														description={woc.workReportForm.description}
													/>
												:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 h-full min-h-[120px]">
														Tidak tersedia
													</div>
												}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* ── CTA ── */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
					className="flex justify-end gap-3 pb-4">
					<Button
						variant="outline"
						className="rounded-xl h-11 px-6 cursor-pointer"
						onClick={() => navigate(-1)}>
						Batal
					</Button>
					<Button
						className="rounded-xl h-11 px-8 cursor-pointer gap-2"
						onClick={() => {
							console.log("Generate from template:", templateId);
						}}>
						<Sparkles className="w-4 h-4" />
						Gunakan Template Ini
					</Button>
				</motion.div>
			</motion.div>
		</>
	);
};

export default ServicesTypePreview;
