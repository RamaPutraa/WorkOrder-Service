import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Bot, User, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

import type {
	FaqChatbotProps,
	ChatMessage,
	FAQData,
} from "./faq-chatbot.types";
import { MOCK_FAQS, MOCK_AI_RESPONSE } from "./faq-chatbot.mock";

export function FaqChatbot({
	title = "FAQ & Bantuan",
	faqs = MOCK_FAQS,
	// role = "client",
}: FaqChatbotProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: "init-1",
			sender: "ai",
			text: `Halo! Saya asisten virtual sistem. Ada yang bisa saya bantu terkait ${title}?`,
			isButtonList: true,
			buttons: faqs,
		},
	]);

	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isTyping, isOpen]);

	const handleSendMessage = (text: string) => {
		if (!text.trim()) return;

		// Add user message
		const userMsg: ChatMessage = {
			id: Date.now().toString(),
			sender: "user",
			text: text,
		};
		setMessages((prev) => [...prev, userMsg]);
		setInputValue("");
		setIsTyping(true);

		// Simulate AI delay
		setTimeout(() => {
			setIsTyping(false);
			const aiResponseText = MOCK_AI_RESPONSE(text);
			const aiMsg: ChatMessage = {
				id: (Date.now() + 1).toString(),
				sender: "ai",
				text: aiResponseText,
			};
			setMessages((prev) => [...prev, aiMsg]);
		}, 1200);
	};

	const handleFaqClick = (faq: FAQData) => {
		handleSendMessage(faq.question);
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
						className="mb-4">
						<div className="w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-6rem)] shadow-2xl flex flex-col overflow-hidden border-border/50 rounded-xl">
							{/* Header */}
							<div className="bg-primary px-4 py-3 flex flex-row items-center justify-between space-y-0 rounded-t-xl shrink-0">
								<div className="flex items-center gap-2">
									<div className="bg-primary-foreground/20 p-1.5 rounded-full">
										<Bot className="w-5 h-5 text-primary-foreground" />
									</div>
									<div>
										<CardTitle className="text-primary-foreground text-sm font-semibold">
											{title}
										</CardTitle>
										<p className="text-primary-foreground/80 text-xs">
											AI Assistant
										</p>
									</div>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground h-8 w-8 rounded-full"
									onClick={() => setIsOpen(false)}>
									<X className="w-4 h-4" />
								</Button>
							</div>

							{/* Chat Area */}
							<div className="flex-1 min-h-0 p-0 flex flex-col bg-white dark:bg-slate-950/50 overflow-hidden">
								<ScrollArea className="h-full w-full">
									<div className="space-y-4 p-4">
										{messages.map((msg) => (
											<div
												key={msg.id}
												className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
												{msg.sender === "ai" && (
													<Avatar className="w-8 h-8 border border-primary/20 shrink-0">
														<div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary">
															<Bot className="w-4 h-4" />
														</div>
													</Avatar>
												)}
												<div
													className={`flex flex-col gap-2 max-w-[80%] ${
														msg.sender === "user" ? "items-end" : "items-start"
													}`}>
													<div
														className={`p-3 rounded-2xl text-sm ${
															msg.sender === "user" ?
																"bg-primary text-primary-foreground rounded-tr-sm"
															:	"bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-foreground rounded-tl-sm shadow-sm"
														}`}>
														{msg.text}
													</div>

													{/* Render FAQ Buttons if this is an AI message with suggested FAQS */}
													{msg.isButtonList &&
														msg.buttons &&
														msg.buttons.length > 0 && (
															<div className="flex flex-wrap gap-2 mt-1">
																{msg.buttons.map((faq) => (
																	<button
																		key={faq.id}
																		onClick={() => handleFaqClick(faq)}
																		className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-colors text-left">
																		{faq.question}
																	</button>
																))}
															</div>
														)}
												</div>
												{msg.sender === "user" && (
													<Avatar className="w-8 h-8 shrink-0">
														<div className="bg-slate-200 dark:bg-slate-800 w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium text-xs">
															<User className="w-4 h-4" />
														</div>
													</Avatar>
												)}
											</div>
										))}

										{/* Typing Indicator */}
										{isTyping && (
											<div className="flex gap-3 justify-start">
												<Avatar className="w-8 h-8 border border-primary/20 shrink-0">
													<div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary">
														<Bot className="w-4 h-4" />
													</div>
												</Avatar>
												<div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
													<motion.div
														className="w-1.5 h-1.5 bg-primary/40 rounded-full"
														animate={{ y: [0, -4, 0] }}
														transition={{
															duration: 0.6,
															repeat: Infinity,
															delay: 0,
														}}
													/>
													<motion.div
														className="w-1.5 h-1.5 bg-primary/60 rounded-full"
														animate={{ y: [0, -4, 0] }}
														transition={{
															duration: 0.6,
															repeat: Infinity,
															delay: 0.2,
														}}
													/>
													<motion.div
														className="w-1.5 h-1.5 bg-primary/80 rounded-full"
														animate={{ y: [0, -4, 0] }}
														transition={{
															duration: 0.6,
															repeat: Infinity,
															delay: 0.4,
														}}
													/>
												</div>
											</div>
										)}
										<div ref={scrollRef} />
									</div>
								</ScrollArea>
							</div>

							{/* Input Area/footer */}
							<div className="p-4 bg-white dark:bg-slate-950 border-t border-border/50 shrink-0">
								<form
									className="w-full flex gap-2 items-center"
									onSubmit={(e) => {
										e.preventDefault();
										handleSendMessage(inputValue);
									}}>
									<Input
										placeholder="Ketik pertanyaan Anda..."
										className="flex-1 rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/30"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										disabled={isTyping}
									/>
									<Button
										type="submit"
										size="icon"
										disabled={!inputValue.trim() || isTyping}
										className="shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
										<Send className="w-5 h-5 translate-x-[-1px] translate-y-[1px]" />
									</Button>
								</form>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Action Button */}
			<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					className={`w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 ${
						isOpen ?
							"bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
						:	"bg-primary hover:bg-primary/90 text-primary-foreground"
					}`}>
					{isOpen ?
						<X className="w-6 h-6" />
					:	<MessageCircleQuestion className="w-6 h-6" />}
				</Button>
			</motion.div>
		</div>
	);
}
