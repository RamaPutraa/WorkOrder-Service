import {
	CheckCircle2Icon,
	ChevronRight,
	Info,
	Shield,
	XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WoAlertsReportProps {
	wo: WorkOrderDetail;
	workReport: WorkReport | null;
}

export const WoAlertsReport = ({ wo, workReport }: WoAlertsReportProps) => {
	const navigate = useNavigate();
	const alerts = [];

	const handleNavigate = () => {
		navigate(`/dashboard/internal/workorders/${wo._id}/report`);
	};

	if (
		workReport &&
		workReport.workReportApprovalAccessType === "manager" &&
		workReport.status === "submitted"
	) {
		alerts.push(
			<div
				key="report-manager-submitted"
				onClick={handleNavigate}
				className="max-w-full bg-amber-50 text-amber-800 border border-amber-200 [&>svg]:text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex gap-4">
							<div className="pt-1">
								<Shield className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">Menunggu Persetujuan</p>
								<p className="text-xs text-muted-foreground">
									Laporan perintah kerja sedang menunggu persetujuan atasan
								</p>
							</div>
						</div>
					</div>
					<ChevronRight className="h-4 w-4" />
				</div>
			</div>,
		);
	}

	if (
		workReport &&
		workReport.workReportApprovalAccessType === "manager" &&
		workReport.status === "rejected" &&
		wo.status !== "failed"
	) {
		alerts.push(
			<div
				key="report-manager-rejected"
				onClick={handleNavigate}
				className="max-w-full bg-red-50 text-red-800 border  border-red-200 [&>svg]:text-red-800 cursor-pointer hover:bg-red-100 transition-colors rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex gap-4">
							<div className="pt-1">
								<XCircle className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">Laporan Ditolak</p>
								<p className="text-xs text-muted-foreground">
									Laporan perintah kerja ditolak, silahkan periksa kembali
								</p>
							</div>
						</div>
					</div>
					<ChevronRight className="h-4 w-4" />
				</div>
			</div>,
		);
	}

	if (
		workReport &&
		workReport.workReportApprovalAccessType === "manager" &&
		workReport.status === "approved" &&
		wo.status !== "failed"
	) {
		alerts.push(
			<div
				key="report-manager-approved"
				onClick={handleNavigate}
				className="max-w-full bg-blue-50 text-blue-800 border [&>svg]:text-blue-800 cursor-pointer hover:bg-blue-100 transition-colors rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex gap-4">
							<div className="pt-1">
								<CheckCircle2Icon className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">Laporan Disetujui</p>
								<p className="text-xs text-muted-foreground">
									Laporan perintah kerja sudah disetujui
								</p>
							</div>
						</div>
					</div>
					<ChevronRight className="h-4 w-4" />
				</div>
			</div>,
		);
	}

	// Fallback if no specific report alerts were added
	if (alerts.length === 0) {
		alerts.push(
			<div
				key="report-empty"
				onClick={handleNavigate}
				className="max-w-full bg-gray-50 text-gray-800 border [&>svg]:text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex gap-4">
							<div className="pt-1">
								<Info className="h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">Detail Laporan</p>
								<p className="text-xs text-muted-foreground">
									Laporan perintah kerja masih dalam tahap pengerjaan
								</p>
							</div>
						</div>
					</div>
					<ChevronRight className="h-4 w-4" />
				</div>
			</div>,
		);
	}

	return <div className="flex flex-col gap-2">{alerts}</div>;
};
