import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Info,
	CheckCircle2Icon,
	XCircle,
	RefreshCw,
	Ban,
	CircleCheckBig,
} from "lucide-react";

interface WoAlertsProps {
	wo: WorkOrderDetail;
	meta: WorkOrderMeta;
}

export const WoAlerts = ({ wo, meta }: WoAlertsProps) => {
	const { can_start, can_complete, can_fail, can_recreate } =
		meta.workOrderCapabilities;
	const isActionable = can_start || can_complete || can_fail;

	const alerts = [];

	// 1. Alerts based on actionable capabilities and explicit terminal states
	if (can_start) {
		alerts.push(
			<Alert
				key="can-start"
				className="max-w-full bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-800">
				<Info className="h-4 w-4" />
				<AlertTitle>Bisa Dimulai</AlertTitle>
				<AlertDescription>
					Tugas kerja ini bisa mulai dikerjakan sekarang.
				</AlertDescription>
			</Alert>,
		);
	}

	if (can_complete) {
		alerts.push(
			<Alert
				key="can-complete"
				className="max-w-full bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-800">
				<CheckCircle2Icon className="h-4 w-4" />
				<AlertTitle>Siap Diselesaikan</AlertTitle>
				<AlertDescription>Tugas kerja ini dapat ditutup.</AlertDescription>
			</Alert>,
		);
	}

	if (wo.status === "cancelled") {
		alerts.push(
			<Alert
				key="cancelled"
				className="max-w-full bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-800">
				<XCircle className="h-4 w-4" />
				<AlertTitle>Dibatalkan</AlertTitle>
				<AlertDescription>Tugas kerja ini telah dibatalkan.</AlertDescription>
			</Alert>,
		);
	}

	if (wo.status === "failed") {
		alerts.push(
			<Alert
				key="failed"
				className="max-w-full bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-800">
				<XCircle className="h-4 w-4" />
				<AlertTitle>Terdapat Masalah</AlertTitle>
				<AlertDescription>
					Tugas kerja memiliki kendala, tugas kerja tidak terselesaikan.
				</AlertDescription>
			</Alert>,
		);
	}

	if (can_recreate) {
		alerts.push(
			<Alert
				key="can-recreate"
				className="max-w-full bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-800">
				<RefreshCw className="h-4 w-4" />
				<AlertTitle>Ditolak</AlertTitle>
				<AlertDescription>
					Tugas kerja ini dapat dibuat ulang atau dibatalkan.
				</AlertDescription>
			</Alert>,
		);
	}

	// 2. Status-based alerts (only if the user cannot take direct action)
	if (!isActionable) {
		if (wo.status === "drafted") {
			alerts.push(
				<Alert
					key="status-drafted"
					className="max-w-full bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-yellow-800">
					<Ban className="h-4 w-4" />
					<AlertTitle>Dirancang</AlertTitle>
					<AlertDescription>
						Perintah kerja ini masih dalam tahap desain/konfigurasi
					</AlertDescription>
				</Alert>,
			);
		}

		if (wo.status === "completed") {
			alerts.push(
				<Alert
					key="status-completed"
					className="max-w-full bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-800">
					<CircleCheckBig className="h-4 w-4" />
					<AlertTitle>Selesai</AlertTitle>
					<AlertDescription>Perintah kerja ini telah selesai.</AlertDescription>
				</Alert>,
			);
		}

		if (wo.status === "sent") {
			alerts.push(
				<Alert
					key="status-sent"
					className="max-w-full bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-yellow-800">
					<Ban className="h-4 w-4" />
					<AlertTitle>Menunggu Persetujuan</AlertTitle>
					<AlertDescription>
						Menunggu konfirmasi departemen terkait.
					</AlertDescription>
				</Alert>,
			);
		}

		if (wo.status === "approved") {
			alerts.push(
				<Alert
					key="status-approved"
					className="max-w-full bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-800">
					<CheckCircle2Icon className="h-4 w-4" />
					<AlertTitle>Disetujui</AlertTitle>
					<AlertDescription>
						Menunggu konfirmasi perintah kerja terkait.
					</AlertDescription>
				</Alert>,
			);
		}
		if (!can_recreate) {
			if (wo.status === "rejected") {
				alerts.push(
					<Alert
						key="status-rejected"
						className="max-w-full bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-800">
						<XCircle className="h-4 w-4" />
						<AlertTitle>Ditolak</AlertTitle>
						<AlertDescription>
							Perintah kerja ini telah ditolak.
						</AlertDescription>
					</Alert>,
				);
			}
		}
		if (wo.status === "on_progress") {
			alerts.push(
				<Alert
					key="status-on-progress"
					className="max-w-full bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-800">
					<CheckCircle2Icon className="h-4 w-4" />
					<AlertTitle>Sedang Dikerjakan</AlertTitle>
					<AlertDescription>Perintah kerja sedang dikerjakan.</AlertDescription>
				</Alert>,
			);
		}
	}

	return <>{alerts}</>;
};
