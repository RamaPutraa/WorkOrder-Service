import React from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PageHeader = ({
	title,
	subtitle,
	onAddClick,
	addLabel = "Tambah Data",
	backPath,
}: {
	title: string;
	subtitle: string;
	onAddClick: () => void;
	addLabel?: string;
	backPath?: boolean;
}) => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-100 mb-8">
			<div className="flex items-center gap-4">
				{/* Tombol Back - Versi Outline Minimalis */}
				{backPath && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigate(-1)}
						className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-none">
						<ChevronLeft className="w-5 h-5" />
					</Button>
				)}

				<div className="space-y-1">
					<h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
						{title}
					</h1>
					{subtitle && (
						<p className="text-sm text-slate-500 font-medium leading-relaxed">
							{subtitle}
						</p>
					)}
				</div>
			</div>

			{/* Tombol Aksi - Versi Minimalis */}
			{onAddClick && (
				<Button
					onClick={onAddClick}
					className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-11 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 active:scale-95">
					<Plus className="w-4 h-4" />
					<span className="font-semibold text-sm">{addLabel}</span>
				</Button>
			)}
		</div>
	);
};

export default PageHeader;
