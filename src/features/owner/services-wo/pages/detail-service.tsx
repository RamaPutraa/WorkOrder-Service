import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateService } from "../hooks/useCreateService";
import { toggleServiceActiveApi } from "../services/servicesWo";
import { useServiceStore } from "@/store/serviceStore";
import { useDialogStore } from "@/store/dialogStore";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { Switch } from "@/components/ui/switch";
import {
	CalendarDays,
	CheckCircle2,
	ClipboardCheck,
	FileText,
	Globe,
	Lock,
	Pencil,
	ScrollText,
	Settings2,
	Trash2,
	Users2,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
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
		<div className="flex items-center justify-center size-10 rounded-lg bg-primary/5 text-primary shrink-0 shadow-sm">
			{icon}
		</div>
		<div className="space-y-1">
			<h3 className="font-semibold text-muted-foreground text-sm tracking-wide uppercase line-clamp-1 lg:text-wrap">
				{title}
			</h3>
			<p className="text-sm text-muted-foreground line-clamp-1 lg:text-wrap">
				{subtitle}
			</p>
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
	order,
	title,
	description,
	formType,
	fields,
}: {
	order?: number;
	title: string;
	description: string;
	formType: string;
	fields?: { label: string; type: string }[] | any[];
}) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="hover:cursor-pointer group rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors h-full flex flex-col gap-3">
				{/* Form type label */}
				<p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
					{formTypeLabel(formType)}
				</p>

				{/* Icon + title block */}
				<div className="flex items-center gap-3">
					<div className="shrink-0 p-3 bg-primary/5 text-primary rounded-xl">
						<ScrollText className="w-5 h-5" />
					</div>
					{order !== undefined && (
						<span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
							{order}
						</span>
					)}
					<div className="flex-1 min-w-0">
						<p className="font-semibold text-sm truncate">{title}</p>
						{description && (
							<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
								{description}
							</p>
						)}
					</div>
				</div>
				{/* Footer: field count + button */}
				<div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
					<span className="text-xs text-muted-foreground">
						{fields && fields.length > 0 ?
							`${fields.length} field tersedia`
						:	"Tidak ada field"}
					</span>
				</div>
			</div>

			{/* Dialog */}
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

const DetailService = () => {
	const navigate = useNavigate();
	const { detailService, loading, getDetailService, removeService } =
		useCreateService();
	const { showDialog } = useDialogStore();
	const clearServiceCache = useServiceStore((state) => state.clearCache);

	const handleToggleActive = () => {
		if (!detailService) return;

		showDialog({
			title: "Konfirmasi Ubah Status",
			description: `Apakah Anda yakin ingin ${detailService.isActive ? "menonaktifkan" : "mengaktifkan"} layanan ini?`,
			onConfirm: async () => {
				try {
					await toggleServiceActiveApi(detailService._id, {
						isActive: !detailService.isActive,
					});
					clearServiceCache();
					await getDetailService();
					notifySuccess("Status layanan berhasil diubah");
				} catch (error: any) {
					notifyError("Gagal mengubah status layanan", error.message);
				}
			},
		});
	};

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
					:	`Berikut merupakan detail layanan ${detailService?.title} `
				}
				backPath={true}
				addLabel="Edit Layanan"
				addIcon={<Pencil className="size-4" />}
				loading={loading}
				onAddClick={() =>
					navigate(`/dashboard/internal/services/edit/${detailService?._id}`)
				}
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
								{/* Status badge */}
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-3 shrink-0 bg-muted/20 px-4 py-2 rounded-xl border">
										<Switch
											checked={detailService.isActive}
											onCheckedChange={handleToggleActive}
										/>
										<span
											className={`text-sm font-semibold ${detailService.isActive ? "text-emerald-600" : "text-slate-500"}`}>
											{detailService.isActive ? "Aktif" : "Nonaktif"}
										</span>
									</div>
									<div className="items-center gap-3 shrink-0 bg-muted/20 rounded-md border">
										<Button
											variant="destructive"
											size="icon"
											className="h-8 w-8 "
											onClick={() =>
												showDialog({
													title: "Hapus Layanan",
													description: `Apakah Anda yakin ingin menghapus layanan "${detailService.title}"?`,
													confirmText: "Hapus",
													cancelText: "Batal",
													onConfirm: async () => {
														if (detailService._id) {
															const success = await removeService(
																detailService._id,
															);
															if (success) {
																navigate("/dashboard/internal/services");
															}
														}
													},
												})
											}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
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

							{/* Approval config */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Settings2 className="size-3.5 text-muted-foreground" />
									<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
										Konfigurasi Persetujuan
									</p>
								</div>

								<div className="grid sm:grid-cols-2 gap-3">
									{/* Tipe Persetujuan */}
									<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1 hover:bg-muted/40 transition-colors">
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground ">
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

									{/* Review Diperlukan */}
									<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1 hover:bg-muted/40 transition-colors">
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground ">
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

									{/* Drafting Mode */}
									<div className="rounded-xl border bg-muted/20 px-4 py-3 space-y-1 hover:bg-muted/40 transition-colors">
										<p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground ">
											Tipe Drafting
										</p>
										<div className="flex items-center gap-1.5">
											{detailService.drafting_work_order_type === "manual" ?
												<>
													<CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
													<p className="text-sm font-medium">Manual (Draft)</p>
												</>
											:	<>
													<CheckCircle2 className="size-4 text-blue-500 shrink-0" />
													<p className="text-sm font-medium">Otomatis</p>
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
							subtitle="Berikut merupakan detail formulir yang akan diisi oleh pengguna saat mengajukan permintaan layanan dan juga formulir yang akan diisi untuk meninjau permintaan layanan."
						/>

						<div className="grid lg:grid-cols-2 gap-4">
							{/* Intake Form */}
							<div className="intake">
								{detailService.serviceRequestConfig?.intakeForm ?
									<FormCard
										title={detailService.serviceRequestConfig.intakeForm.title}
										description={
											detailService.serviceRequestConfig.intakeForm.description
										}
										formType={
											detailService.serviceRequestConfig.intakeForm.formType
										}
										fields={
											detailService.serviceRequestConfig.intakeForm.fields
										}
									/>
								:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 h-full min-h-[100px]">
										Formulir permintaan tidak tersedia.
									</div>
								}
							</div>

							{/* Review Form */}
							<div className="review">
								{detailService.serviceRequestConfig?.reviewForm ?
									<FormCard
										title={detailService.serviceRequestConfig.reviewForm.title}
										description={
											detailService.serviceRequestConfig.reviewForm.description
										}
										formType={
											detailService.serviceRequestConfig.reviewForm.formType
										}
										fields={
											detailService.serviceRequestConfig.reviewForm.fields
										}
									/>
								:	<div className="rounded-xl border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground italic bg-muted/10 h-full min-h-[100px]">
										Formulir ulasan tidak tersedia.
									</div>
								}
							</div>
						</div>

						{/* Report Visibility Config */}
						<div className="rounded-xl border bg-slate-50/50 p-4 flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-semibold text-slate-900">
									Visibilitas Laporan ke Klien
								</p>
								<p className="text-xs text-slate-500">
									Klien dapat melihat laporan pengerjaan yang dibuat oleh staf.
								</p>
							</div>
							<div className="flex items-center gap-2">
								{(
									detailService.workOrdersConfig?.[0]
										.show_report_to_requester === true
								) ?
									<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 shadow-none">
										Terlihat oleh Klien
									</Badge>
								:	<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-600 border-slate-200 shadow-none">
										Tersembunyi
									</Badge>
								}
							</div>
						</div>
					</section>

					{/* ── Work Orders Config ── */}
					{detailService.workOrdersConfig &&
						detailService.workOrdersConfig.length > 0 && (
							<section className="space-y-4">
								<SectionHeader
									icon={<Settings2 className="size-4" />}
									title="Detail Konfigurasi Perintah Kerja"
									subtitle="Berikut merupakan detail konfigurasi perintah kerja yang akan dikerjakan oleh pegawai."
								/>

								<div className="space-y-5">
									{detailService.workOrdersConfig.map((wo, i) => (
										<div
											key={i}
											className="rounded-2xl border bg-card p-5 lg:p-6 shadow-sm">
											{/* Grid 3 Kolom */}
											<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
												{/* ── Kolom 1: Posisi & Persetujuan ── */}
												<div className="flex flex-col space-y-6 lg:border-r lg:pr-8 border-border/50">
													{/* Card Informasi Penugasan */}
													<div className="space-y-4">
														<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
															<Users2 className="size-3.5 text-primary" />
															Informasi Penugasan
														</p>
														<div className="flex flex-col gap-3">
															{/* Main Position Card */}
															<div className="flex items-center gap-4 p-4 rounded-2xl border bg-muted/20 hover:bg-muted/30 transition-all duration-200">
																<div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
																	<Users2 className="size-5" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
																		Posisi Penanggung Jawab
																	</p>
																	<p className="font-bold text-base truncate text-foreground">
																		{wo.positionsOnDuty?.name ?? "—"}
																	</p>
																</div>
															</div>

															{/* Staff Limits Grid */}
															<div className="grid grid-cols-2 gap-3">
																<div className="bg-muted/10 border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-muted/20 transition-all duration-200 group">
																	<p className="text-2xl font-bold text-primary leading-none group-hover:scale-110 transition-transform">
																		{wo.minStaff}
																	</p>
																	<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-2">
																		Min. Staff
																	</p>
																</div>
																<div className="bg-muted/10 border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-muted/20 transition-all duration-200 group">
																	<p className="text-2xl font-bold text-primary leading-none group-hover:scale-110 transition-transform">
																		{wo.maxStaff}
																	</p>
																	<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-2">
																		Max. Staff
																	</p>
																</div>
															</div>
														</div>
													</div>

													{/* Card Approval / Persetujuan */}
													<div className="space-y-4 mt-auto">
														<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
															<CheckCircle2 className="size-3.5 text-primary" />
															Hak Akses Persetujuan
														</p>
														<div className="grid grid-cols-2 gap-3">
															<div className="rounded-2xl border bg-muted/20 p-4 flex flex-col justify-center gap-1.5 hover:bg-muted/30 transition-all duration-200">
																<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
																	Tugas Kerja
																</p>
																<p className="text-xs font-bold text-foreground">
																	{approvalLabel[
																		wo.workOrderApprovalAccessType as unknown as string
																	] ?? String(wo.workOrderApprovalAccessType)}
																</p>
															</div>
															<div className="rounded-2xl border bg-muted/20 p-4 flex flex-col justify-center gap-1.5 hover:bg-muted/30 transition-all duration-200">
																<p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
																	Pelaporan
																</p>
																<p className="text-xs font-bold text-foreground">
																	{approvalLabel[
																		wo.workReportApprovalAccessType as unknown as string
																	] ?? String(wo.workReportApprovalAccessType)}
																</p>
															</div>
														</div>
													</div>
												</div>

												{/* ── Kolom 2: Form Perintah Kerja ── */}
												<div className="flex flex-col space-y-3">
													<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
														<FileText className="size-3.5" />
														Formulir Perintah Kerja
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

												{/* ── Kolom 3: Form Laporan Kerja ── */}
												<div className="flex flex-col space-y-3">
													<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
														<ClipboardCheck className="size-3.5" />
														Formulir Laporan Kerja
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
		</>
	);
};

export default DetailService;
