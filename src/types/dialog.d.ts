type DialogConfig = {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
};
