import { FileQuestionMark } from "lucide-react";

export interface EmptyDataProps {
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	icon?: React.ElementType;
}

export function EmptyData({
	title = "Tidak ada data.",
	subtitle = "Data yang anda cari belum tersedia.",
	icon: Icon = FileQuestionMark,
}: EmptyDataProps) {
	return (
		<div className="flex flex-col items-center py-16 text-center border rounded-2xl border-dashed border-slate-200 border-1.5">
			<div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
				<Icon className="w-7 h-7 text-slate-400" />
			</div>
			<p className="text-sm font-semibold text-slate-600">{title}</p>
			<p className="text-xs text-slate-400 mt-1">{subtitle}</p>
		</div>
	);
}
