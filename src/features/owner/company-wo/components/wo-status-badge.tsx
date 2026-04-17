import {
	Clock,
	ArrowLeftRight,
	CheckCircle2,
	Hourglass,
	Play,
	XCircle,
	CheckCheck,
} from "lucide-react";

export const getStatusConfig = (status: string) => {
	switch (status) {
		case "drafted":
			return {
				label: "Dirancang",
				colorClass: "text-gray-600 bg-gray-100 border-gray-200",
				dotClass: "bg-gray-400",
				icon: Clock,
			};
		case "sent":
			return {
				label: "Dikirim",
				colorClass: "text-blue-600 bg-blue-50 border-blue-200",
				dotClass: "bg-blue-400",
				icon: ArrowLeftRight,
			};
		case "approved":
			return {
				label: "Disetujui",
				colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200",
				dotClass: "bg-emerald-400",
				icon: CheckCircle2,
			};

		case "unprocessable":
			return {
				label: "Belum Dapat Dikerjakan",
				colorClass: "text-amber-600 bg-amber-50 border-amber-200",
				dotClass: "bg-amber-400",
				icon: Hourglass,
			};
		case "onprogress":
			return {
				label: "Sedang Dikerjakan",
				colorClass: "text-indigo-600 bg-indigo-50 border-indigo-200",
				dotClass: "bg-indigo-400",
				icon: Play,
			};
		case "failed":
			return {
				label: "Gagal",
				colorClass: "text-red-600 bg-red-50 border-red-200",
				dotClass: "bg-red-400",
				icon: XCircle,
			};
		case "completed":
			return {
				label: "Selesai",
				colorClass: "text-green-600 bg-green-50 border-green-200",
				dotClass: "bg-green-400",
				icon: CheckCheck,
			};
		case "rejected":
			return {
				label: "Ditolak",
				colorClass: "text-red-600 bg-red-50 border-red-200",
				dotClass: "bg-red-400",
				icon: XCircle,
			};
		default:
			return {
				label: status,
				colorClass: "text-gray-600 bg-gray-100 border-gray-200",
				dotClass: "bg-gray-400",
				icon: Clock,
			};
	}
};

export const StatusBadge = ({ status }: { status: string }) => {
	const config = getStatusConfig(status);
	const Icon = config.icon;
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.colorClass}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
			<Icon className="w-3.5 h-3.5" />
			{config.label}
		</span>
	);
};
