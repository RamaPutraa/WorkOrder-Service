import {
	ChevronRight,
	Clock,
	FileSearch,
	ShieldCheck,
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
				className="group rounded-lg">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-amber-100 text-amber-600 transition-colors">
						<Clock className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-amber-900 leading-tight">
							Menunggu Persetujuan
						</p>
						<p className="text-xs text-amber-700/80 mt-0.5">
							Laporan perintah kerja sedang menunggu persetujuan atasan
						</p>
					</div>
					<div
						onClick={handleNavigate}
						className="flex items-center gap-1 bg-primary px-3 py-3 shadow-sm rounded-2xl cursor-pointer hover:bg-primary/90 active:scale-95 transition-all">
						<p className="text-sm font-medium text-white leading-tight">
							Lihat Detail Laporan
						</p>
						<ChevronRight className="h-4 w-4 text-white shrink-0" />
					</div>
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
				className="group rounded-lg">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-red-100 text-red-600 transition-colors">
						<XCircle className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-red-900 leading-tight">
							Laporan Ditolak
						</p>
						<p className="text-xs text-red-700/80 mt-0.5">
							Laporan perintah kerja ditolak, silahkan periksa kembali
						</p>
					</div>
					<div
						onClick={handleNavigate}
						className="flex items-center gap-1 bg-primary px-3 py-3 shadow-sm rounded-2xl cursor-pointer hover:bg-primary/90 active:scale-95 transition-all">
						<p className="text-sm font-medium text-white leading-tight">
							Lihat Detail Laporan
						</p>
						<ChevronRight className="h-4 w-4 text-white shrink-0" />
					</div>
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
				className="group rounded-lg">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-green-100 text-green-600">
						<ShieldCheck className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-green-800 leading-tight">
							Laporan Disetujui
						</p>
						<p className="text-xs text-green-700/80 mt-0.5">
							Laporan perintah kerja sudah disetujui
						</p>
					</div>
					<div
						onClick={handleNavigate}
						className="flex items-center gap-1 bg-primary px-3 py-3 shadow-sm rounded-2xl cursor-pointer hover:bg-primary/90 active:scale-95 transition-all">
						<p className="text-sm font-medium text-white leading-tight">
							Lihat Detail Laporan
						</p>
						<ChevronRight className="h-4 w-4 text-white shrink-0" />
					</div>
				</div>
			</div>,
		);
	}

	// Fallback if no specific report alerts were added
	if (alerts.length === 0) {
		alerts.push(
			<div
				key="report-empty"
				className="group rounded-lg">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-muted text-muted-foreground transition-colors">
						<FileSearch className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-foreground leading-tight">
							Laporan Pengerjaan
						</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							Laporan perintah kerja masih dalam tahap pengerjaan
						</p>
					</div>
					<div
						onClick={handleNavigate}
						className="flex items-center gap-1 bg-primary px-3 py-3 shadow-sm rounded-2xl cursor-pointer hover:bg-primary/90 active:scale-95 transition-all">
						<p className="text-sm font-medium text-white leading-tight">
							Lihat Detail Laporan
						</p>
						<ChevronRight className="h-4 w-4 text-white shrink-0" />
					</div>
				</div>
			</div>,
		);
	}

	return <div className="flex flex-col gap-2">{alerts}</div>;
};
