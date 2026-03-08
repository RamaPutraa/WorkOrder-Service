import { useNavigate } from "react-router-dom";
import { useCompanyWo } from "../hooks/use-company-wo";
import { Button } from "@/components/ui/button";
import { Calendar, User, CheckCircle2, Play, X } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import StaffAssigned from "../components/staff-assigned";
import WorkOrderForms from "../components/work-order-forms";
import {
	markWorkOrderReady,
	startWorkOrderApi,
} from "../services/company-wo-service";
import { handleApi } from "@/lib/handle-api";
import { notifyError, notifySuccess } from "@/lib/toast-helper";
import { useDialogStore } from "@/store/dialogStore";
import { useAuthStore } from "@/store/authStore";
import { SectionLoading } from "@/shared/atoms";
import PageHeader from "@/shared/atoms/header-content";
import { TextLoading } from "@/shared/atoms/loading-state";

const CompanyDetailWo = () => {
	const navigate = useNavigate();
	const {
		detailData,
		employees,
		fecthDetailInternalCompanyWorkOrder,
		fetchEmployeeList,
	} = useCompanyWo();
	const { showDialog } = useDialogStore();
	const { user } = useAuthStore();

	// Check if user is staff_company (read-only mode)
	const isReadOnly = user?.role === "staff_company";

	// Assigned Staff (UI State)
	const [assignedStaffsUI, setAssignedStaffsUI] = useState<StaffItem[]>([]);
	const [isSticky, setIsSticky] = useState(false);
	const [isSubmittingReady, setIsSubmittingReady] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	// Setelah detailData berhasil load → isi assigned staff ke UI state
	// useEffect(() => {
	// 	if (detailData) {
	// 		setAssignedStaffsUI(detailData.assignedStaffs ?? []);
	// 	}
	// }, [detailData]);

	// Detect scroll for sticky header
	useEffect(() => {
		const handleScroll = () => {
			setIsSticky(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Handle mark as ready
	const handleMarkReady = () => {
		showDialog({
			title: "Konfirmasi Konfigurasi Selesai",
			description:
				"Apakah Anda yakin konfigurasi sudah selesai dan siap untuk memulai perintah kerja?",
			confirmText: "Ya, Selesai",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsSubmittingReady(true);
				const { error } = await handleApi(() =>
					markWorkOrderReady(detailData!._id),
				);

				setIsSubmittingReady(false);

				if (error) {
					notifyError("Gagal menandai konfigurasi selesai", error.message);
					return;
				}

				notifySuccess("Konfigurasi Selesai", "Work order siap untuk dimulai");

				// Refresh detail data
				if (detailData) {
					fecthDetailInternalCompanyWorkOrder(detailData._id);
				}
			},
		});
	};

	// Handle start work order
	const handleStartWorkOrder = () => {
		showDialog({
			title: "Mulai Perintah Kerja",
			description:
				"Apakah Anda yakin ingin memulai perintah kerja ini? Status akan berubah menjadi 'Sedang Dikerjakan'.",
			confirmText: "Ya, Mulai",
			cancelText: "Batal",
			onConfirm: async () => {
				setIsStarting(true);
				const { error } = await handleApi(() =>
					startWorkOrderApi(detailData!._id),
				);

				setIsStarting(false);

				if (error) {
					notifyError("Gagal memulai perintah kerja", error.message);
					return;
				}

				notifySuccess("Berhasil Dimulai", "Perintah kerja telah dimulai");

				// Refresh detail data
				if (detailData) {
					fecthDetailInternalCompanyWorkOrder(detailData._id);
				}
			},
		});
	};

	const getHeaderSubtitle = () => {
		if (!detailData) return <TextLoading variant="skeleton" />;
		switch (currentStatus) {
			case "drafted":
				return "Lakukan konfigurasi sebelum memulai perintah kerja.";
			case "ready":
				return "Perintah kerja siap untuk dimulai.";
			case "in_progress":
				return "Perintah kerja sedang dikerjakan.";
			case "completed":
				return "Perintah kerja telah selesai.";
			default:
				return "Detail perintah kerja.";
		}
	};

	// Get current status
	const currentStatus = detailData?.status;

	return (
		<div className="space-y-15">
			{/* ================= STICKY HEADER ================= */}
			<PageHeader
				title="Detail Perintah Kerja"
				subtitle={getHeaderSubtitle()}
				backPath={true}
				// Jika butuh sticky, kamu bisa masukkan ke className
				className={`sticky top-0 z-30 transition-shadow duration-300 ${isSticky ? "shadow-md rounded-b-md px-4 sm:px-6" : ""}`}
				actionButtons={
					!isReadOnly && (
						<>
							{/* Status: drafted */}
							{currentStatus === "drafted" && (
								<Button
									variant="outline"
									className="border-green-500 text-green-600 hover:bg-green-50 flex-1 md:flex-none rounded-xl"
									onClick={handleMarkReady}
									disabled={isSubmittingReady}>
									<CheckCircle2 className="h-4 w-4 mr-2" />
									{isSubmittingReady ? "Memproses..." : "Konfigurasi Selesai"}
								</Button>
							)}

							{/* Status: ready */}
							{currentStatus === "ready" && (
								<>
									<Button
										variant="outline"
										onClick={() => navigate(-1)}
										className="flex-1 md:flex-none rounded-xl">
										<X className="h-4 w-4 mr-2" />
										Batal
									</Button>
									<Button
										className="bg-primary hover:bg-primary/90 flex-1 md:flex-none rounded-xl text-white"
										onClick={handleStartWorkOrder}
										disabled={isStarting}>
										<Play className="h-4 w-4 mr-2" />
										{isStarting ? "Memulai..." : "Mulai Perintah Kerja"}
									</Button>
								</>
							)}

							{/* Status: in_progress, completed, cancelled */}
							{(currentStatus === "in_progress" ||
								currentStatus === "completed" ||
								currentStatus === "cancelled") && (
								<Button
									variant="outline"
									onClick={() => navigate(-1)}
									className="flex-1 md:flex-none rounded-xl">
									Kembali
								</Button>
							)}
						</>
					)
				}
			/>

			{/* ================= CONTENT ================= */}
			{!detailData ?
				<SectionLoading message="Memuat data tugas kerja..." />
			:	<div className="space-y-6">
					{/* GRID 2 KOLOM */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* ---------- CARD WORK ORDER ---------- */}
						<Card className="border rounded-xl shadow-sm">
							<CardHeader>
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold">
										Informasi Work Order
									</h2>
									<Badge className="capitalize">{detailData.status}</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Detail umum mengenai Work Order ini.
								</p>
							</CardHeader>

							<Separator />

							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									{/* Client */}
									<div className="flex items-center space-x-3">
										<User className="size-5 text-muted-foreground" />
										<div>
											<p className="text-xs font-medium text-muted-foreground">
												Client
											</p>
											<p className="text-sm">
												{detailData.createdBy?.name || "-"}
											</p>
										</div>
									</div>

									{/* Tanggal */}
									<div className="flex items-center space-x-3">
										<Calendar className="size-5 text-muted-foreground" />
										<div className="text-left">
											<p className="text-xs font-medium text-muted-foreground">
												Dibuat Pada
											</p>
											<p className="text-sm">
												{new Date(detailData.createdAt).toLocaleDateString(
													"id-ID",
													{
														day: "2-digit",
														month: "long",
														year: "numeric",
													},
												)}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* ---------- CARD SERVICE ---------- */}
						<Card className="border rounded-xl shadow-sm">
							<CardHeader>
								<h2 className="text-lg font-semibold">Detail Service</h2>
								<p className="text-sm text-muted-foreground">
									Informasi service yang terkait pada WO ini.
								</p>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="space-y-1">
									<p className="text-base font-medium">
										{detailData.service?.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{detailData.service?.description}
									</p>
								</div>

								{/* Required Staff */}
								<div className="mt-3">
									<p className="text-xs text-muted-foreground mb-2">
										Kebutuhan Staff
									</p>
									<div className="space-y-1">
										{detailData.service.requiredStaffs.map((rs, idx) => (
											<div
												key={idx}
												className="flex justify-between text-sm border rounded-lg p-2">
												<p className="font-medium">{rs.position.name}</p>
												<p className="text-muted-foreground">
													{rs.minimumStaff} - {rs.maximumStaff} orang
												</p>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* ================= ASSIGNED STAFF ================= */}
					<StaffAssigned
						detailData={detailData}
						employees={employees}
						assignedStaffsUI={assignedStaffsUI}
						setAssignedStaffsUI={setAssignedStaffsUI}
						isReadOnly={isReadOnly}
						fetchEmployeeList={fetchEmployeeList}
					/>

					{/* ================= WORK ORDER FORMS ================= */}
					<WorkOrderForms
						workorderForms={detailData.workorderForms}
						workOrderId={detailData._id}
						submissions={detailData.submissions}
						isReadOnly={isReadOnly}
						onSaveSuccess={() => {
							fecthDetailInternalCompanyWorkOrder(detailData._id);
						}}
					/>
				</div>
			}
		</div>
	);
};

export default CompanyDetailWo;
