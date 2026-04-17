import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWoCreate } from "../hooks/useWoCreate";
import {
	CalendarDays,
	CheckCircle2,
	ClipboardCheck,
	Eye,
	FileText,
	Globe,
	Info,
	Loader2,
	Lock,
	PlusCircle,
	ScrollText,
	Send,
	Settings2,
	Users2,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { SectionLoading, TextLoading } from "@/shared/atoms/loading-state";
import PageHeader from "@/shared/atoms/header-content";
import { EmptyData } from "@/shared/molecules/empty-data";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const accessTypeLabel: Record<
	string,
	{ label: string; icon: React.ReactNode }
> = {
	public: { label: "Publik", icon: <Globe className="size-3.5" /> },
	member_only: { label: "Member Only", icon: <Lock className="size-3.5" /> },
	internal: { label: "Internal", icon: <Lock className="size-3.5" /> },
};

const approvalLabel: Record<string, string> = {
	auto: "Otomatis",
	manager: "Persetujuan Manager",
	staff_pic: "Persetujuan Staff PIC",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
		<div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
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

const FormCard = ({
	title,
	description,
	formType,
	fields,
}: {
	title: string;
	description: string;
	formType: string;
	fields?: { label: string; type: string }[] | any[];
}) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="group rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors h-full flex flex-col gap-3">
				<p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
					{formTypeLabel(formType)}
				</p>

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

				<div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
					<span className="text-xs text-muted-foreground">
						{fields && fields.length > 0 ?
							`${fields.length} field tersedia`
						:	"Tidak ada field"}
					</span>
					{fields && fields.length > 0 && (
						<Button
							size="sm"
							variant="outline"
							className="h-7 gap-1.5 text-xs"
							onClick={() => setOpen(true)}>
							<Eye className="size-3" />
							Lihat Field
						</Button>
					)}
				</div>
			</div>

			{/* Dialog fields */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto pt-10">
					<DialogHeader>
						<div className="flex items-center justify-between gap-2.5 mb-1">
							<div className="flex items-center gap-2">
								<div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
									<ScrollText className="size-4" />
								</div>
								<DialogTitle className="text-base">{title}</DialogTitle>
							</div>
							<Badge
								variant="secondary"
								className="text-[10px] mt-1 capitalize">
								{formTypeLabel(formType)}
							</Badge>
						</div>
						{description && (
							<DialogDescription className="text-xs leading-relaxed">
								{description}
							</DialogDescription>
						)}
					</DialogHeader>
					<Separator />
					<div className="space-y-3 pt-1">
						{fields?.map((field, idx) => (
							<div
								key={idx}
								className="p-4 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
								<FormFieldViewer field={field} answer={null} readOnly />
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

// ─── Main Component ───────────────────────────────────────────────────────────

const WoServicesDetail: React.FC = () => {
	const navigate = useNavigate();
	const { detailService, loading, createWorkOrder, creatingWo } = useWoCreate();

	// Dialog confirmation state
	const [confirmOpen, setConfirmOpen] = useState(false);

	const accessInfo = accessTypeLabel[
		detailService?.accessType as unknown as string
	] ?? {
		label: String(detailService?.accessType),
		icon: <Globe className="size-4" />,
	};

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});

	const handleCreateWoClick = () => {
		setConfirmOpen(true);
	};

	const handleConfirmCreate = async () => {
		if (!detailService) return;
		const success = await createWorkOrder(detailService._id);
		if (success) {
			setConfirmOpen(false);
		}
	};

	return (
		<>
			{/* ── Header ── */}
			<PageHeader
				title={
					loading ?
						<div className="flex items-center gap-1.5">
							Detail Layanan{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Detail Layanan ${detailService?.title}`
				}
				subtitle={
					loading ?
						<div className="flex items-center gap-1.5">
							Berikut merupakan detail layanan{" "}
							<TextLoading variant="dots" message="" className="w-40" />
						</div>
					:	`Berikut merupakan detail layanan ${detailService?.title}`
				}
				backPath={true}
				addLabel="Buat Perintah Kerja"
				addIcon={<Send className="size-4" />}
				loading={loading || creatingWo}
				onAddClick={handleCreateWoClick}
			/>

			{loading ?
				<SectionLoading message="Memuat detail layanan..." />
			: !detailService ?
				<div className="my-10">
					<EmptyData />
				</div>
			:	<div className="space-y-8">
					{/* ── Overview Card ── */}
					<section className="rounded-2xl border bg-card overflow-hidden shadow-xs">
						<div className="p-6 space-y-5">
							{/* Title row */}
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-1 flex-1 min-w-0">
									<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
										Nama Layanan
									</p>
									<h2 className="text-lg font-bold tracking-tight text-foreground leading-snug">
										{detailService.title}
									</h2>
								</div>
								{/* Status */}
								<div className="shrink-0 mt-1">
									{detailService.isActive ?
										<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
											<span className="text-[10px] font-bold uppercase tracking-wider">
												Aktif
											</span>
										</div>
									:	<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100">
											<span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
											<span className="text-[10px] font-bold uppercase tracking-wider">
												Nonaktif
											</span>
										</div>
									}
								</div>
							</div>

							{/* Description */}
							{detailService.description && (
								<p className="text-sm text-muted-foreground leading-relaxed">
									{detailService.description}
								</p>
							)}

							<Separator className="opacity-50" />

							{/* Meta grid */}
							<div className="grid sm:grid-cols-3 gap-4">
								{/* Created At */}
								<div className="flex items-center gap-2.5">
									<div className="size-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
										<CalendarDays className="size-4" />
									</div>
									<div>
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
											Dibuat
										</p>
										<p className="text-xs font-medium mt-0.5">
											{formatDate(detailService.createdAt)}
										</p>
									</div>
								</div>

								{/* Access */}
								<div className="flex items-center gap-2.5">
									<div className="size-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
										{accessInfo.icon}
									</div>
									<div>
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
											Akses
										</p>
										<p className="text-xs font-medium mt-0.5">
											{accessInfo.label}
										</p>
									</div>
								</div>
							</div>

							<Separator className="opacity-50" />

							{/* Approval Config */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Settings2 className="size-3.5 text-muted-foreground" />
									<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
										Konfigurasi Persetujuan
									</p>
								</div>
								<div className="grid sm:grid-cols-2 gap-3">
									<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1">
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
											Tipe Persetujuan
										</p>
										<p className="text-sm font-medium">
											{approvalLabel[
												detailService.serviceRequestConfig
													?.serviceRequestApprovalAccessType as unknown as string
											] ??
												String(
													detailService.serviceRequestConfig
														?.serviceRequestApprovalAccessType,
												)}
										</p>
									</div>
									<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1">
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
											Review Diperlukan
										</p>
										<div className="flex items-center gap-1.5">
											{detailService.serviceRequestConfig?.reviewNeed ?
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

					{/* ── Service Request Config ── */}
					<section className="space-y-5">
						<SectionHeader
							icon={<ClipboardCheck className="size-4" />}
							title="Formulir Permintaan Layanan"
							subtitle="Formulir yang akan diisi oleh pengguna saat mengajukan permintaan layanan."
						/>
						<div className="grid lg:grid-cols-2 gap-4">
							{detailService.serviceRequestConfig?.intakeForm ?
								<FormCard
									title={detailService.serviceRequestConfig.intakeForm.title}
									description={
										detailService.serviceRequestConfig.intakeForm.description
									}
									formType={
										detailService.serviceRequestConfig.intakeForm.formType
									}
									fields={detailService.serviceRequestConfig.intakeForm.fields}
								/>
							:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 min-h-[100px]">
									Formulir permintaan tidak tersedia.
								</div>
							}
							{detailService.serviceRequestConfig?.reviewForm ?
								<FormCard
									title={detailService.serviceRequestConfig.reviewForm.title}
									description={
										detailService.serviceRequestConfig.reviewForm.description
									}
									formType={
										detailService.serviceRequestConfig.reviewForm.formType
									}
									fields={detailService.serviceRequestConfig.reviewForm.fields}
								/>
							:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 min-h-[100px]">
									Formulir ulasan tidak tersedia.
								</div>
							}
						</div>
					</section>

					{/* ── Work Orders Config ── */}
					{detailService.workOrdersConfig &&
						detailService.workOrdersConfig.length > 0 && (
							<section className="space-y-4">
								<SectionHeader
									icon={<Settings2 className="size-4" />}
									title="Detail Konfigurasi Perintah Kerja"
									subtitle="Konfigurasi perintah kerja yang akan dikerjakan oleh pegawai."
								/>
								<div className="space-y-5">
									{detailService.workOrdersConfig.map((wo, i) => (
										<div
											key={i}
											className="rounded-2xl border bg-card p-5 lg:p-6 shadow-sm">
											<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
												{/* Kolom 1: Posisi & Persetujuan */}
												<div className="flex flex-col space-y-6 lg:border-r lg:pr-8 border-border/50">
													<div className="space-y-3">
														<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
															<Users2 className="size-3.5" />
															Informasi Penugasan
														</p>
														<div className="flex items-start gap-4 p-4 rounded-xl border bg-primary/5 hover:bg-primary/10 transition-colors">
															<div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
																<Users2 className="size-5" />
															</div>
															<div className="flex-1 min-w-0 space-y-2">
																<div>
																	<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
																		Posisi Penanggung Jawab
																	</p>
																	<p className="font-semibold text-base truncate mt-0.5 text-foreground">
																		{wo.positionsOnDuty?.name ?? "—"}
																	</p>
																</div>
																<Badge
																	variant="secondary"
																	className="text-xs bg-background/80 hover:bg-background border-muted">
																	{wo.minStaff} – {wo.maxStaff} Orang
																</Badge>
															</div>
														</div>
													</div>

													<div className="space-y-3 mt-auto">
														<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
															<CheckCircle2 className="size-3.5" />
															Hak Akses Persetujuan
														</p>
														<div className="grid grid-cols-2 gap-3">
															<div className="rounded-xl border bg-muted/20 p-3 flex flex-col gap-1">
																<p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
																	Tugas Kerja
																</p>
																<p className="text-xs font-semibold">
																	{approvalLabel[
																		wo.workOrderApprovalAccessType as unknown as string
																	] ?? String(wo.workOrderApprovalAccessType)}
																</p>
															</div>
															<div className="rounded-xl border bg-muted/20 p-3 flex flex-col gap-1">
																<p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
																	Pelaporan
																</p>
																<p className="text-xs font-semibold">
																	{approvalLabel[
																		wo.workReportApprovalAccessType as unknown as string
																	] ?? String(wo.workReportApprovalAccessType)}
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* Kolom 2: WO Form */}
												<div className="flex flex-col space-y-3">
													<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
														<FileText className="size-3.5" />
														Work Order Form
													</p>
													<div className="flex-1">
														{wo.workOrderForm ?
															<FormCard
																title={wo.workOrderForm.title}
																description={wo.workOrderForm.description}
																formType={wo.workOrderForm.formType}
																fields={(wo.workOrderForm as any).fields}
															/>
														:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 h-full min-h-[120px]">
																Tidak tersedia
															</div>
														}
													</div>
												</div>

												{/* Kolom 3: Report Form */}
												<div className="flex flex-col space-y-3">
													<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
														<ClipboardCheck className="size-3.5" />
														Work Report Form
													</p>
													<div className="flex-1">
														{wo.workReportForm ?
															<FormCard
																title={wo.workReportForm.title}
																description={wo.workReportForm.description}
																formType={wo.workReportForm.formType}
																fields={(wo.workReportForm as any).fields}
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
				</div>
			}

			{/* ─── Confirmation Dialog "Buat Perintah Kerja" ─── */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-1">
							<div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
								<Send className="size-5" />
							</div>
							<DialogTitle className="text-base leading-snug">
								Konfirmasi Buat Perintah Kerja
							</DialogTitle>
						</div>
						<DialogDescription className="text-sm leading-relaxed">
							Anda akan membuat perintah kerja berdasarkan layanan{" "}
							<span className="font-semibold text-foreground">
								&quot;{detailService?.title}&quot;
							</span>
							. Setelah dibuat, perintah kerja akan langsung masuk ke daftar
							work order aktif perusahaan Anda.
						</DialogDescription>
					</DialogHeader>

					{/* Info box */}
					<div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs leading-relaxed">
						<Info className="size-4 shrink-0 mt-0.5" />
						<p>
							Apakah Anda sudah memastikan seluruh konfigurasi layanan ini sudah
							sesuai? Tindakan ini tidak dapat dibatalkan secara otomatis.
						</p>
					</div>

					<DialogFooter className="gap-2 ">
						<Button
							variant="outline"
							onClick={() => setConfirmOpen(false)}
							disabled={creatingWo}
							className="rounded-lg hover:cursor-pointer">
							Batal
						</Button>
						<Button
							onClick={handleConfirmCreate}
							disabled={creatingWo}
							className="rounded-lg hover:cursor-pointer">
							{creatingWo ?
								<>
									<Loader2 className="size-4 animate-spin" />
									Membuat...
								</>
							:	<>
									<Send className="size-4" />
									Ya, Buat Sekarang
								</>
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WoServicesDetail;
