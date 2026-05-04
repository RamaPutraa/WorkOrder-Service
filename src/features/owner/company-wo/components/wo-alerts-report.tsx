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
				onClick={handleNavigate}
				className="group cursor-pointer rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100/80 hover:border-amber-300 transition-all duration-200 overflow-hidden">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors">
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
					<ChevronRight className="h-4 w-4 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
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
				className="group cursor-pointer rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/80 hover:border-red-300 transition-all duration-200 overflow-hidden">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
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
					<ChevronRight className="h-4 w-4 text-red-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
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
				className="group cursor-pointer rounded-lg border border-green-200 bg-green-50 hover:bg-green-100/80 hover:border-green-300 transition-all duration-200 overflow-hidden">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
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
					<ChevronRight className="h-4 w-4 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
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
				className="group cursor-pointer rounded-lg border border-border bg-muted/40 hover:bg-muted/70 hover:border-border/80 transition-all duration-200 overflow-hidden">
				<div className="flex items-center gap-4 px-4 py-3.5">
					<div className="shrink-0 p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-muted/80 transition-colors">
						<FileSearch className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-foreground leading-tight">
							Lihat Detail Laporan
						</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							Laporan perintah kerja masih dalam tahap pengerjaan
						</p>
					</div>
					<ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
				</div>
			</div>,
		);
	}

	return <div className="flex flex-col gap-2">{alerts}</div>;
};
