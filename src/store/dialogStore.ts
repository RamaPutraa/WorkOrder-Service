import { create } from "zustand";

type DialogState = {
	isOpen: boolean;
	config: DialogConfig | null;
	showDialog: (config: DialogConfig) => void;
	closeDialog: () => void;
};

export const useDialogStore = create<DialogState>((set) => ({
	isOpen: false,
	config: null,
	showDialog: (config) => set({ isOpen: true, config }),
	closeDialog: () => set({ isOpen: false, config: null }),
}));
