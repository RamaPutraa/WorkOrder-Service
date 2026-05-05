import React from "react";
import { Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ConfirmCreateWoDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	serviceTitle?: string;
}

const ConfirmCreateWoDialog: React.FC<ConfirmCreateWoDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* Header - Premium Style */}
				<div className="bg-gradient-to-b from-primary to-primary/70 p-4 text-white relative">
					<div className="relative z-10 flex flex-col gap-1">
						<div className="flex items-center gap-3 text-white text-md">
							<div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-xl">
								<Send className="w-5 h-5" />
							</div>
							<div>
								<span className="font-bold tracking-tight">
									Konfirmasi Buat Perintah Kerja
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="p-6 space-y-4 bg-white">
					<p className="text-sm text-slate-600 leading-relaxed">
						Tindakan ini akan langsung membuat work order baru berdasarkan
						konfigurasi layanan tersebut di dalam sistem perusahaan Anda.
					</p>
				</div>

				<Separator />

				<div className="px-6 pb-6 pt-2 bg-white">
					<div className="flex flex-row gap-3 w-full">
						<Button
							variant="outline"
							onClick={onClose}
							disabled={loading}
							className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-semibold m-0 text-slate-600 hover:cursor-pointer">
							Batal
						</Button>
						<Button
							onClick={onConfirm}
							disabled={loading}
							className="flex-1 h-11 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold bg-primary hover:bg-primary/90 m-0 hover:cursor-pointer">
							{loading ?
								<Loader2 className="size-4 animate-spin" />
							:	<Send className="size-4" />}
							{loading ? "Membuat..." : "Ya, Buat Sekarang"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmCreateWoDialog;
