import React from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	onAddClick?: () => void;
	addLabel?: string;
	backPath?: boolean;
	actionButtons?: React.ReactNode; // Tambahan: Untuk tombol kustom
	className?: string; // Tambahan: Untuk styling spesifik seperti sticky
}

const PageHeader = ({
	title,
	subtitle,
	onAddClick,
	addLabel = "Tambah Data",
	backPath,
	actionButtons,
	className = "",
}: PageHeaderProps) => {
	const navigate = useNavigate();

	return (
		<div
			className={`flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-100 mb-8 bg-background ${className}`}>
			<div className="flex items-center gap-4">
				{/* Tombol Back */}
				{backPath && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigate(-1)}
						className="h-10 w-10 shrink-0 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-none">
						<ChevronLeft className="w-5 h-5" />
					</Button>
				)}

				<div className="space-y-1">
					<h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight line-clamp-1">
						{title}
					</h1>
					{subtitle && (
						<p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-1">
							{subtitle}
						</p>
					)}
				</div>
			</div>

			{/* Area Tombol Aksi Kanan */}
			<div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
				{/* Jika ada custom buttons, render custom buttons */}
				{actionButtons ?
					actionButtons
				:	/* Jika tidak ada custom buttons tapi ada onAddClick, jalankan yang default */
					onAddClick && (
						<Button
							onClick={onAddClick}
							className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl px-5 h-11 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 active:scale-95">
							<Plus className="w-4 h-4" />
							<span className="font-semibold text-sm">{addLabel}</span>
						</Button>
					)
				}
			</div>
		</div>
	);
};

export default PageHeader;
