import { useDialogStore } from "@/store/dialogStore";
import type { DialogConfig } from "@/types/dialog";
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
					<AlertDialogCancel>{cancelText || "Batal"}</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm?.();
							closeDialog();
						}}>
						{confirmText || "Ya"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
