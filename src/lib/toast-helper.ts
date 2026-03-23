import { toast } from "sonner";

export const notifySuccess = (message: string, description?: string) => {
	toast.success(message, {
		description,
	});
	
	// Set global flag to allow navigation without ConfirmLeaveDialog blocking
	(window as any).__isSubmittingSuccess = true;
	setTimeout(() => {
		(window as any).__isSubmittingSuccess = false;
	}, 100);
};

export const notifyError = (message: string, description?: string) => {
	toast.error(message, {
		description,
	});
};
export const notifyInfo = (message: string, description?: string) => {
	toast.info(message, {
		description,
	});
};

export const notifyWarning = (message: string, description?: string) => {
	toast.warning(message, {
		description,
	});
};
