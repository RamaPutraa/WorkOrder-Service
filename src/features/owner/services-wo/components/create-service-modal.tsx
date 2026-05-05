import { motion } from "framer-motion";
import { ClipboardList, FileText, ArrowRight, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CreateServiceModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectBlank: () => void;
	onSelectTemplate: () => void;
}

export const CreateServiceModal = ({
	open,
	onOpenChange,
	onSelectBlank,
	onSelectTemplate,
}: CreateServiceModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[560px] p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl">
				{/* Header Gradient */}
				<div className="relative bg-gradient-to-b from-primary to-primary/70 px-8 pt-8 pb-10">
					<div className="relative z-10">
						<div className="flex items-center gap-2.5 ">
							<div className="p-2 bg-white/15 rounded-lg">
								<ClipboardList className="w-5 h-5 text-white" />
							</div>
							<DialogTitle className="text-white text-lg font-bold tracking-tight">
								Buat Layanan Baru
							</DialogTitle>
						</div>
					</div>
				</div>

				{/* Cards Section */}
				<div className="px-6 py-6 space-y-3 bg-white">
					{/* Option 1 - Blank */}
					<motion.button
						custom={0}
						initial="hidden"
						animate="visible"
						onClick={onSelectBlank}
						className="group w-full text-left flex items-center gap-5 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md transition-all duration-200 cursor-pointer">
						<div className="hidden md:block">
							<div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-200 ">
								<FileText className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors duration-200" />
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
								Buat dari Awal
							</p>
							<p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
								Konfigurasi layanan sepenuhnya dari nol sesuai kebutuhan Anda.
							</p>
						</div>

						<div className="hidden md:block shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200">
							<ArrowRight className="w-5 h-5" />
						</div>
					</motion.button>

					{/* Option 2 - Template */}
					<motion.button
						custom={1}
						initial="hidden"
						animate="visible"
						onClick={onSelectTemplate}
						className="group w-full text-left flex items-center gap-5 p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden">
						{/* </div> */}
						<div className="hidden md:block">
							<div className="shrink-0 w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
								<Zap className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
							</div>
						</div>

						<div className="flex-1 min-w-0 ">
							<p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
								Gunakan Template
							</p>
							<p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
								Mulai dari template yang sudah dikonfigurasi. Lebih cepat dan
								praktis.
							</p>
						</div>

						<div className="hidden md:block">
							<div className="shrink-0 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200">
								<ArrowRight className="w-5 h-5" />
							</div>
						</div>
					</motion.button>

					{/* Footer hint */}
					<p className="text-center text-xs text-slate-400 pt-1">
						Anda dapat mengubah konfigurasi layanan kapan saja setelah dibuat.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};
