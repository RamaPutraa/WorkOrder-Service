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

export default function ConfirmDialog() {
	const [loading, setLoading] = useState(false);
	const { isOpen, config, closeDialog } = useDialogStore();

	if (!config) return null;

	const { title, description, confirmText, cancelText, onConfirm } =
		config as DialogConfig;

	return (
		<AlertDialog open={isOpen} onOpenChange={closeDialog}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description && (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>
						{cancelText || "Batal"}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={loading}
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
						:	confirmText || "Ya"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
