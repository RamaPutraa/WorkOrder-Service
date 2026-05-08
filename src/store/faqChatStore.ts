import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "@/shared/organism/faq-chatbot/faq-chatbot.types";

interface FaqChatState {
	chatHistory: Record<string, ChatMessage[]>;
	addMessage: (companyId: string, message: ChatMessage) => void;
	clearChatHistory: () => void;
}

export const useFaqChatStore = create<FaqChatState>()(
	persist(
		(set) => ({
			chatHistory: {},
			addMessage: (companyId, message) =>
				set((state) => {
					const history = state.chatHistory[companyId] || [];
					return {
						chatHistory: {
							...state.chatHistory,
							[companyId]: [...history, message],
						},
					};
				}),
			clearChatHistory: () => set({ chatHistory: {} }),
		}),
		{
			name: "faq-chat-storage", // nama key di localStorage
		},
	),
);
