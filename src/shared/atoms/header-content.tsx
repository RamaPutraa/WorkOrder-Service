import React from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ButtonLoading } from "@/shared/atoms/loading-state";
import CityBg from "@/assets/images/city.svg";

interface PageHeaderProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	onAddClick?: () => void;
	addLabel?: string;
	addIcon?: React.ReactNode; // Tambahan: Icon kustom
	loading?: boolean; // Tambahan: Loading state
	backPath?: boolean | string; // true = navigate(-1), string = navigate ke path tertentu
	actionButtons?: React.ReactNode;
	className?: string;
}

const PageHeader = ({
	title,
	subtitle,
	onAddClick,
	addLabel = "Tambah Data",
	addIcon = <Plus className="w-4 h-4" />,
	loading = false,
	backPath,
	actionButtons,
	className = "",
}: PageHeaderProps) => {
	const navigate = useNavigate();

	return (
		<div
			className={`relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 shadow-sm rounded-xl p-4 mb-8 bg-background ${className}`}>

			{/* Background Image */}
			<div
				className="absolute -inset-x-1 top-0 -bottom-20 z-0 opacity-10 bg-no-repeat bg-cover bg-bottom pointer-events-none"
				style={{ backgroundImage: `url(${CityBg})` }}
			/>

			<div className="relative z-10 flex items-center gap-4 ">
				{/* Tombol Back */}
				{backPath && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => typeof backPath === "string" ? navigate(backPath) : navigate(-1)}
						className="h-10 w-10 shrink-0 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-none hover:cursor-pointer bg-white">
						<ChevronLeft className="w-5 h-5" />
					</Button>
				)}

				<div className="space-y-1">
					<h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight line-clamp-1">
						{title}
					</h1>
					{subtitle && (
						<div className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-1">
							{subtitle}
						</div>
					)}
				</div>
			</div>

			{/* Area Tombol Aksi Kanan */}
			<div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
				{/* Jika ada custom buttons, render custom buttons */}
				{actionButtons ?
					actionButtons
					:	/* Jika tidak ada custom buttons tapi ada onAddClick, jalankan yang default */
					onAddClick && (
						<Button
							onClick={onAddClick}
							disabled={loading}
							className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white rounded-xl px-5 h-11 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer">
							{loading ?
								<ButtonLoading />
								: addIcon}
							<span className="font-semibold text-sm">
								{loading ? "Memuat..." : addLabel}
							</span>
						</Button>
					)
				}
			</div>
		</div>
	);
};

export default PageHeader;
