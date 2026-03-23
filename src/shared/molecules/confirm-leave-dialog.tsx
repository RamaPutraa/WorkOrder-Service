import React from "react";
import { useBlocker } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
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

interface ConfirmLeaveDialogProps {
	isDirty: boolean;
	isOpen?: boolean;
	onConfirm?: () => void;
	onCancel?: () => void;
}

export const ConfirmLeaveDialog: React.FC<ConfirmLeaveDialogProps> = ({
	isDirty,
	isOpen = false,
	onConfirm,
	onCancel,
}) => {
	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			isDirty &&
			currentLocation.pathname !== nextLocation.pathname &&
			!(window as any).__isSubmittingSuccess,
	);

	// Kombinasi state: Diblokir oleh router ATAU dibuka secara manual via props
	const isDialogOpen = blocker.state === "blocked" || isOpen;

	return (
		<AlertDialog
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) {
					if (blocker.state === "blocked") {
						blocker.reset();
					}
					onCancel?.();
				}
			}}>
			{/* max-w-[400px] dengan p-6 agar proporsinya pas untuk modal tengah */}
			<AlertDialogContent className="sm:max-w-[400px] gap-0 rounded-2xl p-6">
				{/* Lingkaran Icon di Tengah */}
				<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/80 dark:bg-amber-500/20">
					<AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-500" />
				</div>

				<AlertDialogHeader className="space-y-2 text-center">
					<AlertDialogTitle className="text-xl font-semibold tracking-tight text-center">
						Perubahan belum disimpan
					</AlertDialogTitle>
					<AlertDialogDescription className="text-base text-muted-foreground leading-relaxed text-center pb-4">
						Anda memiliki perubahan data yang belum disimpan. Jika Anda pergi
						sekarang, perubahan tersebut akan hilang.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Footer diset sm:justify-center agar tombol berada di tengah */}
				<AlertDialogFooter className="sm:justify-center w-full border-t border-slate-100 dark:border-slate-800 pt-5 mt-2 sm:space-x-3">
					<AlertDialogCancel
						onClick={() => {
							if (blocker.state === "blocked") blocker.reset();
							onCancel?.();
						}}
						className="border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg">
						Tetap di sini
					</AlertDialogCancel>

					{/* Tombol Action menggunakan warna soft amber agar senada dengan icon */}
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault(); // Mencegah dialog tertutup otomatis yang memicu blocker.reset()
							if (blocker.state === "blocked") {
								blocker.proceed();
							}
							onConfirm?.();
						}}
						className="bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors rounded-lg">
						Tinggalkan
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
