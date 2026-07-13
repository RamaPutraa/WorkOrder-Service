import { motion } from "framer-motion";
import { Mail, QrCode, ArrowRight, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface AddStaffMethodDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectEmail: () => void;
	onSelectCode: () => void;
}

export const AddStaffMethodDialog = ({
	open,
	onOpenChange,
	onSelectEmail,
	onSelectCode,
}: AddStaffMethodDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl">
				{/* Header Gradient */}
				<div className="relative bg-gradient-to-b from-primary to-primary/70 px-8 pt-7 pb-10">
					<div className="relative z-10">
						<div className="flex items-center gap-2.5">
							<div className="p-2 bg-white/15 rounded-lg">
								<Users className="w-5 h-5 text-white" />
							</div>
							<DialogTitle className="text-white text-lg font-bold tracking-tight">
								Tambah Pegawai
							</DialogTitle>
						</div>
						<p className="text-white/70 text-xs mt-2 ml-0.5">
							Pilih cara untuk mengundang pegawai bergabung ke perusahaan Anda.
						</p>
					</div>
				</div>

				{/* Cards Section */}
				<div className="px-6 py-6 space-y-3 bg-white">
					{/* Option 1 — Email */}
					<motion.button
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.18 }}
						onClick={onSelectEmail}
						className="group w-full text-left flex items-center gap-5 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md transition-all duration-200 cursor-pointer"
					>
						<div className="hidden md:block">
							<div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-200">
								<Mail className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors duration-200" />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
								Undang Pegawai Melalui Email
							</p>
							<p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
								Kirim undangan langsung ke email pegawai. Pegawai perlu menerima
								undangan untuk bergabung.
							</p>
						</div>
						<div className="hidden md:block shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200">
							<ArrowRight className="w-5 h-5" />
						</div>
					</motion.button>

					{/* Option 2 — Generate Code */}
					<motion.button
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.18, delay: 0.06 }}
						onClick={onSelectCode}
						className="group w-full text-left flex items-center gap-5 p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-md transition-all duration-200 cursor-pointer"
					>
						<div className="hidden md:block">
							<div className="shrink-0 w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
								<QrCode className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
								Generate Kode Undangan Pegawai
							</p>
							<p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
								Buat kode unik yang bisa dibagikan. Pegawai cukup memasukkan
								kode untuk langsung bergabung.
							</p>
						</div>
						<div className="hidden md:block shrink-0 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200">
							<ArrowRight className="w-5 h-5" />
						</div>
					</motion.button>

					<p className="text-center text-xs text-slate-400 pt-1">
						Anda dapat menggunakan keduanya secara bersamaan.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};
