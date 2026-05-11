import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Lightbulb, FileText } from "lucide-react";
import { motion } from "framer-motion";

export interface HintItem {
	title: string;
	desc: string;
}

interface HintDialogProps {
	triggerTitle?: string;
	triggerSubtitle?: string;
	dialogTitle?: string;
	dialogSubtitle?: string;
	items: HintItem[];
}

export const HintDialog: React.FC<HintDialogProps> = ({
	triggerTitle = "Petunjuk",
	triggerSubtitle = "Pahami panduan fitur ini",
	dialogTitle = "Pusat Bantuan",
	dialogSubtitle = "Pahami cara kerja fitur ini untuk hasil yang maksimal.",
	items = [],
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="group flex items-center justify-between p-3.5 rounded-2xl border border-primary/10 cursor-pointer hover:bg-primary/10 transition-all duration-300 shadow-sm hover:shadow-primary/10">
					<div className="flex items-center gap-3.5">
						<div className="relative">
							<div className="relative p-2.5 rounded-xl bg-primary/5 text-primary shadow-inner">
								<Lightbulb className="w-4 h-4 fill-current" />
							</div>
						</div>
						<div className="space-y-0.5">
							<p className="text-sm font-semibold text-primary leading-tight">
								{triggerTitle}
							</p>
							<p className="text-[11px] text-primary/80 font-medium">
								{triggerSubtitle}
							</p>
						</div>
					</div>
					<div className="p-1 rounded-full bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
						<ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
					</div>
				</div>
			</DialogTrigger>

			{/* 1. Tambahkan max-h-[85vh], flex, dan flex-col di DialogContent */}
			<DialogContent className="sm:max-w-[440px] max-h-[85vh] flex flex-col rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
				{/* 2. Tambahkan shrink-0 pada Header agar tidak ikut menyusut saat di-scroll */}
				<div className="shrink-0 bg-gradient-to-b from-primary to-primary/70 p-6 text-white relative">
					<DialogHeader className="relative z-10">
						<DialogTitle className="flex items-center gap-3 text-white text-xl">
							<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
								<FileText className="w-6 h-6" />
							</div>
							<span>{dialogTitle}</span>
						</DialogTitle>
						<DialogDescription className="text-white/90 mt-2 text-sm font-medium opacity-90">
							{dialogSubtitle}
						</DialogDescription>
					</DialogHeader>
				</div>

				{/* 3. Tambahkan flex-1 dan overflow-y-auto pada kontainer item */}
				<div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
					{items.map((item, i) => (
						<motion.div
							key={i}
							className="flex gap-4 p-4 rounded-2xl bg-white border border-blue-100 hover:shadow-md transition-all duration-300 group">
							<div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
								<FileText className="w-5 h-5" />
							</div>
							<div className="space-y-1">
								<p className="text-sm font-bold text-slate-800 leading-tight">
									{item.title}
								</p>
								<p className="text-[12px] text-slate-500 leading-relaxed font-medium">
									{item.desc}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};
