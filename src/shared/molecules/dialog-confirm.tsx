import { useState } from "react";
import { useDialogStore } from "@/store/dialogStore";
import { ButtonLoading } from "@/shared/atoms/loading-state";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog() {
	const [loading, setLoading] = useState(false);
	const { isOpen, config, closeDialog } = useDialogStore();

	if (!config) return null;

	const { title, description, confirmText, cancelText, onConfirm } =
		config as DialogConfig;

	return (
		<AlertDialog open={isOpen} onOpenChange={closeDialog}>
			<AlertDialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
				{/* Gradient Header - Matching HintDialog style */}
				<div className="px-6 py-4 border-b border-border/70 text-dark relative">
					<AlertDialogHeader className="relative z-10">
						<AlertDialogTitle className="flex items-center gap-3 text-dark text-md">
							<div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
								<AlertTriangle className="w-6 h-6 text-primary" />
							</div>
							<span>{title}</span>
						</AlertDialogTitle>
					</AlertDialogHeader>
				</div>
				<div className="px-6 py-1	 border-b border-border/70">
					{description && (
						<AlertDialogDescription className="text-dark pb-6 text-sm font-medium opacity-90 ">
							{description}
						</AlertDialogDescription>
					)}
				</div>
				{/* Footer / Actions */}
				<div className="px-6 pb-6 bg-white">
					<AlertDialogFooter className="flex flex-col gap-3 w-full">
						<AlertDialogCancel
							disabled={loading}
							className="flex-1 h-10 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-medium m-0 hover:cursor-pointer">
							{cancelText || "Batal"}
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={loading}
							className="flex-1 h-10 rounded-xl shadow-sm hover:shadow-md transition-all font-medium bg-primary hover:bg-primary/90 m-0 hover:cursor-pointer"
							onClick={async (e) => {
								if (onConfirm) {
									e.preventDefault(); // Mencegah dialog tertutup otomatis
									try {
										setLoading(true);
										await onConfirm();
									} finally {
										setLoading(false);
										closeDialog();
									}
								} else {
									closeDialog();
								}
							}}>
							{loading ?
								<ButtonLoading />
							:	confirmText || "Ya, Lanjutkan"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
