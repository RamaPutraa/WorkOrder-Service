import { useCompanyDetailWo } from "../hooks/use-company-detail-wo";
import { Button } from "@/components/ui/button";
import StaffAssigned from "../components/staff-assigned";
import { StatusBadge } from "../components/wo-status-badge";
import { InfoRow } from "../components/wo-info-row";
import { SiblingCard } from "../components/wo-sibling-card";
import WorkOrderForms from "../components/work-order-forms";
import { WoAlerts } from "../components/wo-alerts";
import { WoAlertsReport } from "../components/wo-alerts-report";
import { WoActionButtons } from "../components/wo-action-buttons";
import {
	Calendar,
	Shield,
	AlertTriangle,
	FileText,
	Settings2,
	ArrowLeftRight,
	Info,
	User,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WoStatusStepper } from "../components/wo-status-stepper";
// Helpers

const formatDate = (dateStr: string | null | undefined) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
};

//  Main Component

const CompanyDetailWo = () => {
	const {
		navigate,
		user,
		isReadOnly,
		isSticky,
		activeAction,
		isFailDialogOpen,
		setIsFailDialogOpen,
		failIssue,
		setFailIssue,
		isCompleteDialogOpen,
		setIsCompleteDialogOpen,
		completeIssue,
		setCompleteIssue,
		workReport,
		wo,
		meta,
		currentStatus,
		canStart,
		canComplete,
		canFail,
		userPic,
		userCreated,
		userAssigned,
		isDrafted,
		canCancel,
		canRecreateEdit,
		getHeaderSubtitle,
		isPageLoading,
		handleSendWorkOrder,
		handleStartWorkOrder,
		handleApproveWorkOrder,
		handleRejectWorkOrder,
		handleCompleteWorkOrder,
		handleCancelWorkOrder,
		handleFailWorkOrder,
		handleRecreateWorkOrder,
		employees,
		fetchEmployeeList,
		refreshBackground,
		isCardRefreshing,
		setIsCardRefreshing,
		setIsFormDirty,
	} = useCompanyDetailWo();
	return (
		<div className="space-y-6">
			{/*  Sticky Header  */}
			<PageHeader
				title="Detail Perintah Kerja"
				subtitle={getHeaderSubtitle()}
				backPath={true}
				className={`sticky top-0 z-30 transition-shadow duration-300 ${isSticky ? "shadow-md rounded-b-md px-4 sm:px-6 bg-background" : ""}`}
				actionButtons={
					wo ?
						<WoActionButtons
							user={user}
							woId={wo._id}
							isReadOnly={isReadOnly}
							userPic={userPic}
							userAssigned={userAssigned ?? false}
							userCreated={userCreated}
							currentStatus={currentStatus ?? ""}
							canCancel={canCancel ?? false}
							canStart={canStart ?? false}
							canFail={canFail ?? false}
							canComplete={canComplete ?? false}
							canRecreate={canRecreateEdit ?? false}
							activeAction={activeAction}
							navigate={navigate}
							onCancel={handleCancelWorkOrder}
							onSend={handleSendWorkOrder}
							onReject={handleRejectWorkOrder}
							onApprove={handleApproveWorkOrder}
							onStart={handleStartWorkOrder}
							onRecreate={handleRecreateWorkOrder}
							onFail={() => setIsFailDialogOpen(true)}
							onComplete={() => setIsCompleteDialogOpen(true)}
						/>
					:	null
				}
			/>

			{/*  Loading  */}
			{isPageLoading ?
				<SectionLoading message="Memuat data perintah kerja..." />
			:	null}

			{/*  Content  */}
			{wo && !isPageLoading && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-6">
					{/*  Row 2: 3-column grid  */}
					<div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-5">
						{/* Card 1: Info Umum */}
						<div className="border shadow-sm rounded-xl md:col-span-2 px-7 py-3">
							<div className="space-y-2">
								{/*  Row 1: Status Hero Banner  */}
								<div className="overflow-hidden border-0 ">
									{/* status wo */}

									<div className="relative">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-7">
											<div className="flex items-center gap-4">
												<div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
													<FileText className="w-6 h-6" />
												</div>
												<div>
													<h2 className="text-lg font-bold text-foreground leading-tight">
														{wo.service?.title || "-"}
													</h2>
													<p className="text-sm text-muted-foreground mt-0.5">
														{wo.service?.description || "-"}
													</p>
												</div>
											</div>
											{/* Mobile Badge Fallback */}
											<div className="flex md:hidden flex-col sm:items-end gap-1.5 mt-3 sm:mt-0">
												<div className="flex flex-wrap items-center gap-2">
													<StatusBadge status={wo.status} />
													{wo.has_issue && wo.status == "failed" && (
														<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border text-orange-600 bg-orange-50 border-orange-200">
															<AlertTriangle className="w-3.5 h-3.5" />
															Ada Kendala
														</span>
													)}
												</div>
												<span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
													<Calendar className="w-3 h-3" />
													{formatDate(wo.updatedAt)}
												</span>
											</div>
										</div>
										{/* <div className="border-t border-border/50 p-0 hidden md:block"></div> */}
										<div className="pb-4  w-full hidden md:block">
											<span className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
												<Settings2 className="w-3.5 h-3.5 mr-1" />
												Status Perintah Kerja:
											</span>
											<WoStatusStepper wo={wo} />
										</div>
										<div className="grid gird-cols-1 gap-4 lg:grid-cols-2">
											{/* Capabilities Bar */}
											{meta?.workOrderCapabilities && (
												<div className="mt-5 flex flex-col gap-3">
													<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
														<Settings2 className="w-3.5 h-3.5 mr-1" />
														Keterangan perintah kerja:
													</span>

													<div className="flex flex-col gap-2">
														<WoAlerts wo={wo} meta={meta} />
													</div>
												</div>
											)}

											<div className="mt-5 flex flex-col gap-3">
												<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
													<Settings2 className="w-3.5 h-3.5 mr-1" />
													Keterangan Kendala :
												</span>
												<div className="flex flex-col gap-2">
													{/*  Issue note  */}
													{wo.has_issue &&
														wo.issue_note &&
														wo.status == "failed" && (
															<Alert className="max-w-full bg-orange-50 text-orange-800 border-orange-200 [&>svg]:text-orange-800">
																<Info className="h-4 w-4" />
																<AlertTitle>Catatan Masalah</AlertTitle>
																<AlertDescription>
																	{wo.issue_note}
																</AlertDescription>
															</Alert>
														)}

													{wo.has_issue && wo.status === "completed" && (
														<Alert className="max-w-full bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-800">
															<Info className="h-4 w-4" />
															<AlertTitle>Catatan</AlertTitle>
															<AlertDescription>
																{wo.issue_note}
															</AlertDescription>
														</Alert>
													)}

													{!wo.has_issue && (
														<Alert className="max-w-full bg-gray-50 text-gray-800 border-gray-200 [&>svg]:text-gray-800">
															<Info className="h-4 w-4" />
															<AlertTitle>Catatan</AlertTitle>
															<AlertDescription>-</AlertDescription>
														</Alert>
													)}
												</div>
											</div>
										</div>

										{/* work report */}
										{(wo.status === "on_progress" ||
											wo.status === "completed" ||
											wo.status === "failed") && (
											<div className="pt-8 w-full">
												<div className="rounded-xl border border-blue-200 px-5 py-4">
													<div className="flex items-center gap-2 mb-3">
														<div className="p-1.5 rounded-md bg-primary/5 text-primary">
															<FileText className="w-3.5 h-3.5" />
														</div>
														<span className="text-xs font-semibold text-primary uppercase tracking-wide">
															Laporan Pengerjaan Perintah Kerja
														</span>
													</div>
													<WoAlertsReport wo={wo} workReport={workReport} />
												</div>
											</div>
										)}
									</div>
								</div>

								{/* informasi lainnya */}
								<div className="grid grid-cols-1 xl:grid-cols-2 ">
									<div className="px-3 py-3 space-y-3">
										<InfoRow
											icon={ArrowLeftRight}
											label="Tipe Persetujuan WO"
											value={
												wo.workOrderApprovalAccessType === "auto" ?
													"Otomatis"
												:	"Staff PIC"
											}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={User}
											label="Dibuat Oleh"
											value={
												<div className="flex items-center gap-2">
													<div>
														<p className="text-sm font-medium leading-tight">
															{wo.createdBy?.name || "-"}
														</p>
														<p className="text-xs text-muted-foreground">
															{wo.createdBy?.email || ""}
														</p>
													</div>
												</div>
											}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={Shield}
											label="Disetujui Oleh"
											value={
												wo.approvedBy ?
													<div className="flex items-center gap-2">
														<div>
															<p className="text-sm font-medium leading-tight">
																{wo.approvedBy?.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{wo.approvedBy?.email}
															</p>
														</div>
													</div>
												: wo.workOrderApprovalAccessType === "auto" ?
													"Otomatis disetujui"
												:	"Belum disetujui"
											}
										/>
										<div className="border-b border-border/50" />
									</div>
									<div className="px-3 py-3 space-y-3">
										<InfoRow
											icon={Calendar}
											label="Tanggal Dibuat"
											value={formatDate(wo.createdAt)}
										/>
										<div className="border-b border-border/50" />

										<InfoRow
											icon={Calendar}
											label="Terakhir Diperbarui"
											value={formatDate(wo.updatedAt)}
										/>
									</div>
								</div>
								{/* siblings wo */}
								{wo.meta?.workOrderSiblings &&
									wo.meta?.workOrderSiblings.length > 1 && (
										<div className=" flex flex-col gap-3 my-7">
											<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
												<Settings2 className="w-3.5 h-3.5 mr-1" />
												Perintah Kerja Terkait :
											</span>
											<div className="flex flex-col gap-2">
												{meta?.workOrderSiblings &&
													meta.workOrderSiblings.length > 0 && (
														<div className="">
															<div className="space-y-2">
																{meta.workOrderSiblings.map(
																	(sibling, index) => (
																		<SiblingCard
																			key={sibling._id}
																			sibling={sibling}
																			currentId={wo._id}
																			index={index + 1}
																		/>
																	),
																)}
															</div>
														</div>
													)}
											</div>
										</div>
									)}
							</div>
						</div>

						{/* Card 2: Kebutuhan Staff */}
						<StaffAssigned
							wo={wo}
							employees={employees}
							fetchEmployeeList={fetchEmployeeList}
							isReadOnly={isReadOnly}
							currentStatus={currentStatus}
							canRecreateEdit={canRecreateEdit}
							onAssignSuccess={async () => {
								setIsCardRefreshing(true);
								refreshBackground();
								setIsCardRefreshing(false);
							}}
							isRefreshing={isCardRefreshing}
						/>
					</div>

					{/*  Row 5: Work Order Form Info  */}
					<WorkOrderForms
						workOrderForm={wo.workOrderForm}
						workOrderId={wo._id}
						submissions={wo.submissions || []}
						isReadOnly={isReadOnly || (!isDrafted && !canRecreateEdit)}
						onSaveSuccess={async () => {
							setIsFormDirty(false);
							setIsCardRefreshing(true);
							refreshBackground();
							setIsCardRefreshing(false);
						}}
						isRefreshing={isCardRefreshing}
						onDirtyChange={setIsFormDirty}
					/>
				</motion.div>
			)}

			{/* is fail dialog */}
			<Dialog open={isFailDialogOpen} onOpenChange={setIsFailDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Gagalkan Perintah Kerja</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin menggagalkan perintah kerja ini? Silakan
							masukkan catatan kendala atau alasan mengapa gagal.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="issue" className="text-left font-semibold">
								Catatan Kendala <span className="text-red-500">*</span>
							</Label>
							<Textarea
								id="issue"
								placeholder="Tulis alasan kendala di sini..."
								value={failIssue}
								onChange={(e) => setFailIssue(e.target.value)}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsFailDialogOpen(false)}
							disabled={activeAction !== null}>
							Batal
						</Button>
						<Button
							variant="destructive"
							onClick={handleFailWorkOrder}
							disabled={activeAction !== null}>
							{activeAction === "fail" ? "Memproses..." : "Konfirmasi Gagal"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* is complete dialog */}
			<Dialog
				open={isCompleteDialogOpen}
				onOpenChange={setIsCompleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Selesaikan Perintah Kerja</DialogTitle>
						<DialogDescription>
							Apakah Anda yakin ingin menyelesaikan perintah kerja ini? Status
							akan berubah menjadi "Selesai". Anda dapat menambahkan catatan
							opsional jika diperlukan.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label
								htmlFor="complete-issue"
								className="text-left font-semibold">
								Catatan Opsional
							</Label>
							<Textarea
								id="complete-issue"
								placeholder="Tambahkan catatan jika ada..."
								value={completeIssue}
								onChange={(e) => setCompleteIssue(e.target.value)}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCompleteDialogOpen(false)}
							disabled={activeAction !== null}>
							Batal
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700 text-white"
							onClick={handleCompleteWorkOrder}
							disabled={activeAction !== null}>
							{activeAction === "complete" ? "Memproses..." : "Selesaikan"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CompanyDetailWo;
