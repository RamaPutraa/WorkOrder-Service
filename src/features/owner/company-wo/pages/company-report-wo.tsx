import { Button } from "@/components/ui/button";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { EmptyData } from "@/shared/molecules/empty-data";
import FormFieldViewer from "@/shared/molecules/form-field-viewer";
import { useCompanyReportWo } from "../hooks/use-company-report-wo";
import {
	Calendar,
	Clock,
	XCircle,
	CheckCircle2,
	Pencil,
	Save,
	Settings2,
	Send,
	User,
} from "lucide-react";

const CompanyReportWo = () => {
	const {
		reportData,
		formObject,
		loading,
		error,
		isSaving,
		isProcessing,
		isEditMode,
		setIsEditMode,
		formData,
		isReviewer,
		canEdit,
		canSendReport,
		handleFieldChange,
		hasChanges,
		handleSave,
		handleCancel,
		handleSendWorkReport,
		handleApproveReport,
		handleRejectReport,
		getStatusConfig,
	} = useCompanyReportWo();

	const statusConfig = reportData ? getStatusConfig(reportData.status) : null;
	const StatusIcon = statusConfig?.icon ?? Clock;

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Laporan Tugas Kerja"
				subtitle="Tinjau dan kelola rincian penyelesaian tugas kerja"
				backPath={true}
				addIcon={<Send className="h-4 w-4" />}
				loading={isSaving}
				actionButtons={
					!canSendReport ?
						reportData?.status === "submitted" && (
							<>
								<Button
									onClick={handleRejectReport}
									disabled={isProcessing}
									className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-red-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
									<XCircle className="w-4 h-4" />
									{isProcessing ? "..." : "Tolak"}
								</Button>
								<Button
									onClick={handleApproveReport}
									disabled={isProcessing}
									className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
									<CheckCircle2 className="w-4 h-4" />
									{isProcessing ? "..." : "Setujui"}
								</Button>
							</>
						)
					:	<Button
							className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl  h-11 shadow-sm shadow-blue-200 transition-all flex items-center active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
							onClick={handleSendWorkReport}
							disabled={isSaving}>
							<Send className="h-4 w-4" />
							{isSaving ? "Memproses..." : "Finalisasi Laporan"}
						</Button>
				}
			/>

			{loading && <SectionLoading message="Memuat laporan..." />}

			{error && !loading && <EmptyData />}

			{!loading && !error && reportData && (
				<div className="space-y-6">
					{/* ── Status Bar ── */}
					<div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
							{/* Status Laporan */}
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<StatusIcon className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Status Laporan
									</p>
									<span className={`text-sm font-bold ${statusConfig?.text}`}>
										{statusConfig?.label}
									</span>
								</div>
							</div>

							{/* Disetujui Oleh */}
							<div className="flex items-center gap-3 sm:border-l sm:pl-6 lg:border-l-0 lg:pl-0 xl:border-l xl:pl-6 border-gray-100">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<User className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Disetujui Oleh
									</p>
									<span
										className={`text-sm font-bold truncate block ${reportData.approvedBy ? "text-gray-900" : "text-gray-400"}`}>
										{reportData.approvedBy ?
											reportData.approvedBy.name
										: reportData.workReportApprovalAccessType === "auto" ?
											"Disetujui Otomatis"
										:	"Belum disetujui"}
									</span>
								</div>
							</div>

							{/* Dibuat Pada */}
							<div className="flex items-center gap-3 lg:border-l lg:pl-6 xl:border-l xl:pl-6 border-gray-100">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<Calendar className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Dibuat Pada
									</p>
									<div className="text-sm font-bold text-gray-900">
										{new Date(reportData.createdAt).toLocaleDateString(
											"id-ID",
											{
												day: "2-digit",
												month: "long",
												year: "numeric",
											},
										)}
									</div>
								</div>
							</div>

							{/* Diperbarui terakhir */}
							<div className="flex items-center gap-3 lg:border-l lg:pl-6 xl:border-l xl:pl-6 border-gray-100">
								<div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
									<Calendar className="w-4 h-4" />
								</div>
								<div className="min-w-0">
									<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
										Terakhir Diperbarui
									</p>
									<div className="text-sm font-bold text-gray-900">
										{reportData?.updatedAt ?
											new Date(reportData.updatedAt).toLocaleDateString(
												"id-ID",
												{
													day: "2-digit",
													month: "long",
													year: "numeric",
												},
											)
										:	"Belum ada perubahan"}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Form Editor Card */}
					<div className="border shadow-sm rounded-2xl overflow-hidden">
						<div className="p-6 pb-2">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
								{/* Title & Icon Area */}
								<div className="flex items-start gap-4">
									<div className="shrink-0 p-2.5 rounded-lg bg-primary/5 text-primary mt-0.5">
										<Settings2 className="w-5 h-5 stroke-[1.5]" />
									</div>
									<div className="space-y-1">
										<h2 className="text-lg font-semibold tracking-tight text-foreground">
											{formObject?.title || "Formulir Laporan"}
										</h2>
										<p className="text-sm text-muted-foreground leading-relaxed">
											{formObject?.description ||
												"Isi rincian hasil pekerjaan di lapangan."}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								{canEdit && (
									<div className="flex items-center gap-2 self-start bg-muted/30 p-1.5 rounded-xl border border-border/50">
										{!isEditMode ?
											// Tombol Edit Mode
											<Button
												variant="ghost"
												onClick={() => setIsEditMode(true)}
												className="h-8 px-3 text-xs font-medium rounded-lg text-foreground hover:bg-background hover:shadow-sm transition-all hover:cursor-pointer"
												title="Edit Laporan">
												<Pencil className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
												Edit Form
											</Button>
										:	<>
												<Button
													variant="ghost"
													onClick={handleCancel}
													disabled={isSaving}
													className="h-8 px-3 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-all hover:cursor-pointer">
													Batal
												</Button>
												<Button
													onClick={handleSave}
													disabled={isSaving || !hasChanges()}
													className="h-8 px-4 text-xs font-semibold rounded-lg shadow-none transition-all hover:cursor-pointer">
													{isSaving ?
														<span className="flex items-center gap-2">
															<div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
															Menyimpan...
														</span>
													:	<span className="flex items-center gap-1.5">
															<Save className="w-3.5 h-3.5" />
															Simpan
														</span>
													}
												</Button>
											</>
										}
									</div>
								)}
							</div>
						</div>

						{/* Content Area */}
						<div className="p-6 pt-4">
							{!formObject ?
								<div className="py-8 bg-muted/20 rounded-xl border border-dashed border-border/50">
									<EmptyData />
								</div>
							:	<div className="space-y-6">
									{formObject.fields && formObject.fields.length > 0 ?
										<div className="flex flex-col gap-6">
											{[...formObject.fields]
												.sort((a, b) => a.order - b.order)
												.map((field, idx) => {
													const answer = formData.get(field.order) ?? null;
													return (
														<div
															key={field.order}
															className={`transition-all duration-300 ${isEditMode ? "p-4 rounded-xl bg-muted/10 border border-border/40 hover:border-primary/20" : ""}`}>
															<FormFieldViewer
																field={field}
																answer={answer}
																index={idx + 1}
																readOnly={!isEditMode || isReviewer}
																onChange={(value) =>
																	handleFieldChange(field.order, value)
																}
															/>
														</div>
													);
												})}
										</div>
									:	<div className="py-8 bg-muted/20 rounded-xl border border-dashed border-border/50">
											<EmptyData />
										</div>
									}
								</div>
							}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CompanyReportWo;
